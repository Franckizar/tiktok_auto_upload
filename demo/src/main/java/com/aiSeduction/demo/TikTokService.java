
// 7. TikTok Service
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

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TikTokService {
    
    private final TikTokOAuthConfig tiktokConfig;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String getTikTokAuthUrl() {
        return UriComponentsBuilder.fromUriString(tiktokConfig.getAuthorizationUrl())
                .queryParam("client_key", tiktokConfig.getClientId())
                .queryParam("scope", "user.info.basic,video.upload,video.publish")
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", tiktokConfig.getRedirectUri())
                .queryParam("state", "random_state_string") // You should generate a random state
                .build()
                .toUriString();
    }
    
    public User handleTikTokCallback(String code, String state) {
        try {
            // Exchange code for access token
            String accessToken = exchangeCodeForToken(code);
            
            // Get user info from TikTok
            JsonNode userInfo = getTikTokUserInfo(accessToken);
            
            // Create or update user
            return createOrUpdateTikTokUser(userInfo, accessToken);
            
        } catch (Exception e) {
            log.error("Error handling TikTok callback: ", e);
            throw new RuntimeException("Failed to authenticate with TikTok");
        }
    }
    
    private String exchangeCodeForToken(String code) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_key", tiktokConfig.getClientId());
        params.add("client_secret", tiktokConfig.getClientSecret());
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", tiktokConfig.getRedirectUri());
        
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
            user.setEmail(""); // TikTok might not provide email
        }
        
        user.setTiktokUsername(tiktokUsername);
        user.setTiktokAccessToken(accessToken);
        user.setTiktokConnected(true);
        user.setTiktokTokenExpiry(LocalDateTime.now().plusDays(30)); // Adjust based on TikTok's token expiry
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
}

// ---