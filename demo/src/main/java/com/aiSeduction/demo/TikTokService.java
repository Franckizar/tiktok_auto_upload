package com.aiSeduction.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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
public class TikTokService {

    private final TikTokOAuthConfig tiktokConfig;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, String> pkceStorage = new ConcurrentHashMap<>();

    public String getTikTokAuthUrl() {
        System.out.println("=== GENERATING TIKTOK AUTH URL ===");
        
        String state = UUID.randomUUID().toString();
        String codeVerifier = generateCodeVerifier();
        String codeChallenge = generateCodeChallenge(codeVerifier);
        
        // Store the code verifier with the state
        pkceStorage.put(state, codeVerifier);
        
        System.out.println("Generated state: " + state);
        System.out.println("Generated code verifier: " + codeVerifier);
        System.out.println("Generated code challenge: " + codeChallenge);
        System.out.println("Storage size after adding: " + pkceStorage.size());
        System.out.println("All states in storage: " + pkceStorage.keySet());

        String authUrl = UriComponentsBuilder.fromUriString(tiktokConfig.getAuthorizationUrl())
                .queryParam("client_key", tiktokConfig.getClientId())
                .queryParam("scope", "user.info.basic")
                // .queryParam("scope", "user.info.basic,video.upload,video.publish")
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", tiktokConfig.getRedirectUri())
                .queryParam("state", state)
                .queryParam("code_challenge", codeChallenge)
                .queryParam("code_challenge_method", "S256")
                .build()
                .toUriString();
        
        System.out.println("Authorization URL: " + tiktokConfig.getAuthorizationUrl());
        System.out.println("Client ID: " + tiktokConfig.getClientId());
        System.out.println("Redirect URI: " + tiktokConfig.getRedirectUri());
        System.out.println("Complete Auth URL: " + authUrl);
        System.out.println("=== AUTH URL GENERATION COMPLETE ===\n");
        
        return authUrl;
    }

    public User handleTikTokCallback(String code, String state) {
        System.out.println("=== HANDLING TIKTOK CALLBACK ===");
        System.out.println("Received code: " + code);
        System.out.println("Received state: " + state);
        System.out.println("Current storage size: " + pkceStorage.size());
        System.out.println("All states in storage: " + pkceStorage.keySet());
        System.out.println("Looking for state: " + state);
        System.out.println("State exists in storage: " + pkceStorage.containsKey(state));
        
        try {
            // Check if state exists before removing
            if (!pkceStorage.containsKey(state)) {
                System.err.println("ERROR: State not found in storage!");
                System.err.println("Received state: '" + state + "'");
                System.err.println("Available states: " + pkceStorage.keySet());
                System.err.println("Storage is empty: " + pkceStorage.isEmpty());
                throw new RuntimeException("Invalid state parameter - state not found in storage");
            }
            
            String codeVerifier = pkceStorage.remove(state);
            System.out.println("Retrieved code verifier: " + codeVerifier);
            System.out.println("Storage size after removal: " + pkceStorage.size());

            if (codeVerifier == null) {
                System.err.println("ERROR: Code verifier is null even though state was found!");
                throw new RuntimeException("Invalid state parameter - code verifier is null");
            }

            System.out.println("Proceeding to exchange code for token...");
            String accessToken = exchangeCodeForToken(code, codeVerifier);
            
            System.out.println("Token exchange successful, getting user info...");
            JsonNode userInfo = getTikTokUserInfo(accessToken);
            
            System.out.println("User info retrieved, creating/updating user...");
            User user = createOrUpdateTikTokUser(userInfo, accessToken);
            
            System.out.println("=== CALLBACK HANDLING COMPLETE ===");
            return user;

        } catch (Exception e) {
            System.err.println("=== ERROR HANDLING TIKTOK CALLBACK ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error class: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Failed to authenticate with TikTok: " + e.getMessage());
        }
    }

    private String exchangeCodeForToken(String code, String codeVerifier) throws Exception {
        System.out.println("=== EXCHANGING CODE FOR TOKEN ===");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_key", tiktokConfig.getClientId());
        params.add("client_secret", tiktokConfig.getClientSecret());
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", tiktokConfig.getRedirectUri());
        params.add("code_verifier", codeVerifier);

        System.out.println("Token URL: " + tiktokConfig.getTokenUrl());
        System.out.println("Client ID: " + tiktokConfig.getClientId());
        System.out.println("Redirect URI: " + tiktokConfig.getRedirectUri());
        System.out.println("Grant Type: authorization_code");
        System.out.println("Code: " + code);
        System.out.println("Code Verifier: " + codeVerifier);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    tiktokConfig.getTokenUrl(), request, String.class
            );

            System.out.println("Token response status: " + response.getStatusCode());
            System.out.println("Token response headers: " + response.getHeaders());
            System.out.println("Token response body: " + response.getBody());

            JsonNode responseJson = objectMapper.readTree(response.getBody());

            if (responseJson.has("error")) {
                String errorCode = responseJson.get("error").asText();
                String errorDescription = responseJson.has("error_description") ? 
                    responseJson.get("error_description").asText() : "No description available";
                
                System.err.println("Token exchange error code: " + errorCode);
                System.err.println("Token exchange error description: " + errorDescription);
                throw new RuntimeException("Token exchange failed: " + errorCode + " - " + errorDescription);
            }

            if (!responseJson.has("access_token")) {
                System.err.println("No access_token in response: " + responseJson.toString());
                throw new RuntimeException("No access token in response");
            }

            String accessToken = responseJson.get("access_token").asText();
            System.out.println("Access token obtained successfully (first 10 chars): " + 
                accessToken.substring(0, Math.min(10, accessToken.length())) + "...");
            
            return accessToken;
            
        } catch (Exception e) {
            System.err.println("Exception during token exchange: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private JsonNode getTikTokUserInfo(String accessToken) throws Exception {
        System.out.println("=== GETTING TIKTOK USER INFO ===");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Content-Type", "application/json");

        HttpEntity<?> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromUriString(tiktokConfig.getUserInfoUrl())
                .queryParam("fields", "open_id,union_id,avatar_url,display_name,username")
                .build()
                .toUriString();

        System.out.println("User info URL: " + url);
        System.out.println("Base user info URL: " + tiktokConfig.getUserInfoUrl());
        System.out.println("Access token (first 10 chars): " + 
            accessToken.substring(0, Math.min(10, accessToken.length())) + "...");

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, String.class
            );

            System.out.println("User info response status: " + response.getStatusCode());
            System.out.println("User info response headers: " + response.getHeaders());
            System.out.println("User info response body: " + response.getBody());

            JsonNode responseJson = objectMapper.readTree(response.getBody());

            if (responseJson.has("error")) {
                JsonNode errorNode = responseJson.get("error");
                String errorMessage = errorNode.has("message") ? 
                    errorNode.get("message").asText() : errorNode.toString();
                
                System.err.println("User info error: " + errorMessage);
                throw new RuntimeException("Failed to get user info: " + errorMessage);
            }

            if (!responseJson.has("data")) {
                System.err.println("No 'data' field in user info response: " + responseJson.toString());
                throw new RuntimeException("Invalid user info response format");
            }

            JsonNode dataNode = responseJson.get("data");
            if (!dataNode.has("user")) {
                System.err.println("No 'user' field in data: " + dataNode.toString());
                throw new RuntimeException("No user data in response");
            }

            JsonNode userNode = dataNode.get("user");
            System.out.println("User data retrieved successfully: " + userNode.toString());
            
            return userNode;
            
        } catch (Exception e) {
            System.err.println("Exception during user info retrieval: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private User createOrUpdateTikTokUser(JsonNode userInfo, String accessToken) {
        System.out.println("=== CREATING/UPDATING TIKTOK USER ===");
        System.out.println("User info JSON: " + userInfo.toString());
        
        if (!userInfo.has("open_id")) {
            System.err.println("Missing open_id in user info");
            throw new RuntimeException("Missing open_id in user info");
        }
        
        String tiktokId = userInfo.get("open_id").asText();
        System.out.println("TikTok ID (open_id): " + tiktokId);
        
        // Handle username/display name
        String tiktokUsername;
        if (userInfo.has("username") && !userInfo.get("username").isNull()) {
            tiktokUsername = userInfo.get("username").asText();
            System.out.println("Using username: " + tiktokUsername);
        } else if (userInfo.has("display_name") && !userInfo.get("display_name").isNull()) {
            tiktokUsername = userInfo.get("display_name").asText();
            System.out.println("Using display_name: " + tiktokUsername);
        } else {
            tiktokUsername = "TikTok_User_" + tiktokId.substring(0, 8);
            System.out.println("Generated username: " + tiktokUsername);
        }

        // Check for existing user
        System.out.println("Checking for existing user with TikTok ID: " + tiktokId);
        Optional<User> existingUser = userRepository.findByTiktokId(tiktokId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            System.out.println("Found existing user: " + user.getUsername() + " (ID: " + user.getId() + ")");
        } else {
            user = new User();
            user.setTiktokId(tiktokId);
            user.setUsername(tiktokUsername);
            user.setEmail(""); // Empty email for TikTok users
            System.out.println("Creating new user");
        }

        // Update TikTok-specific fields
        user.setTiktokUsername(tiktokUsername);
        user.setTiktokAccessToken(accessToken);
        user.setTiktokConnected(true);
        user.setTiktokTokenExpiry(LocalDateTime.now().plusDays(30)); // TikTok tokens typically expire in 24 hours, but using 30 days as buffer
        user.setUpdatedAt(LocalDateTime.now());
        
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        System.out.println("Saving user to database...");
        try {
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            System.out.println("Final user details:");
            System.out.println("  - ID: " + savedUser.getId());
            System.out.println("  - Username: " + savedUser.getUsername());
            System.out.println("  - TikTok ID: " + savedUser.getTiktokId());
            System.out.println("  - TikTok Username: " + savedUser.getTiktokUsername());
            System.out.println("  - TikTok Connected: " + savedUser.isTiktokConnected());
            System.out.println("=== USER CREATION/UPDATE COMPLETE ===");
            
            return savedUser;
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save user: " + e.getMessage());
        }
    }

    private String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String codeVerifier = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        System.out.println("Generated code verifier length: " + codeVerifier.length());
        return codeVerifier;
    }

    private String generateCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
            String codeChallenge = Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
            System.out.println("Generated code challenge length: " + codeChallenge.length());
            return codeChallenge;
        } catch (NoSuchAlgorithmException e) {
            System.err.println("SHA-256 algorithm not available: " + e.getMessage());
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    // Utility method to check storage status
    public void debugStorage() {
        System.out.println("=== PKCE STORAGE DEBUG ===");
        System.out.println("Storage size: " + pkceStorage.size());
        System.out.println("Storage contents: " + pkceStorage);
        System.out.println("========================");
    }
}