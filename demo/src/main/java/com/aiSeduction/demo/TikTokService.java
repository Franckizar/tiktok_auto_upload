package com.aiSeduction.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class TikTokService {

    private final TikTokOAuthConfig tiktokConfig;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, String> pkceStorage = new ConcurrentHashMap<>();

    public String getTikTokAuthUrl() {
        String state = UUID.randomUUID().toString();
        String codeVerifier = generateCodeVerifier();
        String codeChallenge = generateCodeChallenge(codeVerifier);
        pkceStorage.put(state, codeVerifier);

        return UriComponentsBuilder.fromUriString(tiktokConfig.getAuthorizationUrl())
                .queryParam("client_key", tiktokConfig.getClientId())
                .queryParam("scope", "user.info.basic,video.upload,video.publish")
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", tiktokConfig.getRedirectUri())
                .queryParam("state", state)
                .queryParam("code_challenge", codeChallenge)
                .queryParam("code_challenge_method", "S256")
                .build()
                .toUriString();
    }

    public User handleTikTokCallback(String code, String state) {
        try {
            String codeVerifier = pkceStorage.remove(state);
            if (codeVerifier == null) {
                log.error("Invalid or missing state parameter: {}", state);
                throw new RuntimeException("Invalid state parameter");
            }

            String accessToken = exchangeCodeForToken(code, codeVerifier);
            JsonNode userInfo = getTikTokUserInfo(accessToken);
            return createOrUpdateTikTokUser(userInfo, accessToken);

        } catch (Exception e) {
            log.error("Error handling TikTok callback: ", e);
            throw new RuntimeException("Failed to authenticate with TikTok: " + e.getMessage());
        }
    }

    private String exchangeCodeForToken(String code, String codeVerifier) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_key", tiktokConfig.getClientId());
        params.add("client_secret", tiktokConfig.getClientSecret());
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", tiktokConfig.getRedirectUri());
        params.add("code_verifier", codeVerifier);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                tiktokConfig.getTokenUrl(), request, String.class
        );

        JsonNode responseJson = objectMapper.readTree(response.getBody());

        if (responseJson.has("error")) {
            throw new RuntimeException("Token exchange failed: " + responseJson.get("error_description").asText());
        }

        return responseJson.get("access_token").asText();
    }

    private JsonNode getTikTokUserInfo(String accessToken) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<?> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromUriString(tiktokConfig.getUserInfoUrl())
                .queryParam("fields", "open_id,union_id,avatar_url,display_name,username")
                .build()
                .toUriString();

        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, request, String.class
        );

        JsonNode responseJson = objectMapper.readTree(response.getBody());

        if (responseJson.has("error")) {
            throw new RuntimeException("Failed to get user info: " + responseJson.get("error").get("message").asText());
        }

        return responseJson.get("data").get("user");
    }

    private User createOrUpdateTikTokUser(JsonNode userInfo, String accessToken) {
        String tiktokId = userInfo.get("open_id").asText();
        String tiktokUsername = userInfo.get("username") != null ?
                userInfo.get("username").asText() : userInfo.get("display_name").asText();

        Optional<User> existingUser = userRepository.findByTiktokId(tiktokId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setTiktokId(tiktokId);
            user.setUsername(tiktokUsername);
            user.setEmail("");
        }

        user.setTiktokUsername(tiktokUsername);
        user.setTiktokAccessToken(accessToken);
        user.setTiktokConnected(true);
        user.setTiktokTokenExpiry(LocalDateTime.now().plusDays(30));
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String generateCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}