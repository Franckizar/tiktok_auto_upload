package com.aiSeduction.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TikTokService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, String> pkceStorage = new ConcurrentHashMap<>();

    // ⭐ DYNAMIC REDIRECT URI - Works with ngrok AND production
    @Value("${tiktok.redirect-uri:https://modest-integral-ibex.ngrok-free.app/auth/tiktok/callback}")
    private String redirectUri;

    @Value("${tiktok.client-id:sbawcpylm5rplz9cos}")
    private String clientId;

    @Value("${tiktok.client-secret:YOUR_CLIENT_SECRET}")
    private String clientSecret;

    private static final String AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
    private static final String TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
    private static final String USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

    public String getTikTokAuthUrl() {
        log.info("🚀 Generating TikTok OAuth URL | Redirect URI: {}", redirectUri);
        
        try {
            String state = UUID.randomUUID().toString();
            String codeVerifier = generateCodeVerifier();
            String codeChallenge = generateCodeChallenge(codeVerifier);

            pkceStorage.put(state, codeVerifier);
            log.debug("✅ PKCE stored - state: {}, verifier length: {}", state, codeVerifier.length());

            String authUrl = UriComponentsBuilder.fromUriString(AUTH_URL)
                    .queryParam("client_key", clientId)
                    .queryParam("scope", "user.info.basic")
                    .queryParam("response_type", "code")
                    .queryParam("redirect_uri", redirectUri)  // ✅ DYNAMIC!
                    .queryParam("state", state)
                    .queryParam("code_challenge", codeChallenge)
                    .queryParam("code_challenge_method", "S256")
                    .build()
                    .toUriString();

            log.info("✅ TikTok auth URL generated (length: {}) | Will callback to: {}", 
                    authUrl.length(), redirectUri);
            return authUrl;
        } catch (Exception e) {
            log.error("❌ Error generating TikTok auth URL", e);
            throw new RuntimeException("Failed to generate authentication URL", e);
        }
    }

    public User handleTikTokCallback(String code, String state) {
        log.info("🎉 TIKTOK CALLBACK RECEIVED! code: {}, state: {}", code, state);
        
        if (state == null || !pkceStorage.containsKey(state)) {
            log.error("❌ Invalid/missing state: {}", state);
            throw new RuntimeException("Invalid state parameter");
        }

        String codeVerifier = pkceStorage.remove(state);
        log.info("✅ Valid state & PKCE verifier retrieved");

        try {
            // 1. Exchange code for tokens
            TokenResponse tokenResponse = exchangeCodeForToken(code, codeVerifier);
            log.info("✅ Access token obtained: {}", tokenResponse.accessToken().substring(0, 20) + "...");

            // 2. Get user info
            JsonNode userInfo = getTikTokUserInfo(tokenResponse.accessToken());
            log.info("✅ User info: open_id={}, username={}", 
                    userInfo.get("open_id").asText(),
                    userInfo.has("username") ? userInfo.get("username").asText() : "N/A");

            // 3. Save user
            User user = createOrUpdateTikTokUser(userInfo, tokenResponse);
            log.info("🎉 TikTok login SUCCESS: User ID={}", user.getId());
            
            return user;

        } catch (Exception e) {
            log.error("💥 TikTok callback failed", e);
            throw new RuntimeException("TikTok authentication failed", e);
        }
    }

    private TokenResponse exchangeCodeForToken(String code, String codeVerifier) {
        log.info("🔄 Exchanging code for tokens...");
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_key", clientId);
            body.add("client_secret", clientSecret);
            body.add("code", code);
            body.add("grant_type", "authorization_code");
            body.add("redirect_uri", redirectUri);  // ✅ Same as auth URL
            body.add("code_verifier", codeVerifier);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(TOKEN_URL, HttpMethod.POST, request, String.class);
            log.info("📡 Token response: {}", response.getStatusCode());

            // ✅ FIXED: Wrapped in try-catch to handle JsonProcessingException
            JsonNode json = objectMapper.readTree(response.getBody());
            if (json.has("error")) {
                throw new RuntimeException("Token error: " + json.get("error_description").asText());
            }

            return new TokenResponse(
                json.get("access_token").asText(),
                json.get("refresh_token").asText(),
                json.get("expires_in").asLong()
            );
        } catch (Exception e) {
            log.error("❌ Failed to exchange code for token", e);
            throw new RuntimeException("Token exchange failed: " + e.getMessage(), e);
        }
    }

    private JsonNode getTikTokUserInfo(String accessToken) {
        log.info("👤 Fetching TikTok user info...");
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            // ✅ FIXED: Use GET request with query params instead of POST with JSON body
            String url = UriComponentsBuilder.fromUriString(USER_INFO_URL)
                    .queryParam("fields", "open_id,union_id,avatar_url,display_name")
                    .build()
                    .toUriString();

            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            
            // ✅ Log the full response for debugging
            log.info("📡 TikTok User Info Response: {}", response.getBody());
            
            JsonNode json = objectMapper.readTree(response.getBody());

            // ✅ FIXED: Check if error code is NOT "ok" (TikTok always returns error object)
            if (json.has("error") && json.get("error").has("code")) {
                String errorCode = json.get("error").get("code").asText();
                if (!"ok".equalsIgnoreCase(errorCode)) {
                    String errorMsg = json.get("error").has("message") ? 
                        json.get("error").get("message").asText() : errorCode;
                    log.error("❌ TikTok API Error: {}", errorMsg);
                    throw new RuntimeException("User info error: " + errorMsg);
                }
            }

            return json.get("data").get("user");
        } catch (Exception e) {
            log.error("❌ Failed to fetch user info", e);
            throw new RuntimeException("User info fetch failed: " + e.getMessage(), e);
        }
    }

    private User createOrUpdateTikTokUser(JsonNode userInfo, TokenResponse tokenResponse) {
        String tiktokId = userInfo.get("open_id").asText();
        String username = userInfo.has("username") ? userInfo.get("username").asText() : "tiktok_" + tiktokId.substring(0, 8);

        Optional<User> existing = userRepository.findByTiktokId(tiktokId);
        User user = existing.orElseGet(User::new);

        user.setTiktokId(tiktokId);
        user.setUsername(username);
        user.setTiktokAccessToken(tokenResponse.accessToken());
        user.setTiktokRefreshToken(tokenResponse.refreshToken());
        user.setTiktokConnected(true);
        user.setTiktokTokenExpiry(LocalDateTime.now().plusSeconds(tokenResponse.expiresIn()));
        // ✅ REMOVED: user.setRole(Role.USER) - not needed for basic login
        user.setUpdatedAt(LocalDateTime.now());

        if (user.getId() == null) {
            user.setCreatedAt(LocalDateTime.now());
            log.info("🆕 New TikTok user created: {}", username);
        } else {
            log.info("🔄 Existing TikTok user updated: {}", username);
        }

        return userRepository.save(user);
    }

    // PKCE helper methods
    private String generateCodeVerifier() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String generateCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 failed", e);
        }
    }

    // ⭐ Helper record for tokens
    record TokenResponse(String accessToken, String refreshToken, long expiresIn) {}
}
