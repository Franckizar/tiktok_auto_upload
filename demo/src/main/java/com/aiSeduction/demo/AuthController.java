package com.aiSeduction.demo;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final TikTokService tiktokService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        try {
            User user = authService.authenticateUser(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            log.info("Successful login for user: {}", user.getId());
            return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}, username: {}", request.getEmail(), request.getUsername());
        try {
            User user = authService.registerUser(request.getEmail(), request.getPassword(), request.getUsername());
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            log.info("Successful registration for user: {}", user.getId());
            return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
        } catch (Exception e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    @GetMapping("/tiktok/init")
    public ResponseEntity<Map<String, String>> initTikTokAuth() {
        log.info("TikTok auth initialization requested");
        try {
            String authUrl = tiktokService.getTikTokAuthUrl();
            Map<String, String> response = new HashMap<>();
            response.put("authUrl", authUrl);
            response.put("state", "pkce-protected");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to init TikTok auth", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tiktok/callback")
    public void handleTikTokCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false) String error_description,
            HttpServletResponse response) throws IOException {

        log.info("TikTok callback - code: {}, state: {}, error: {}", code, state, error);

        if (error != null) {
            log.error("TikTok error: {} - {}", error, error_description);
            response.sendRedirect(frontendUrl + "?error=" + error_description);
            return;
        }

        if (code == null || code.isBlank()) {
            log.error("Missing code");
            response.sendRedirect(frontendUrl + "?error=Missing authorization code");
            return;
        }

        try {
            User user = tiktokService.handleTikTokCallback(code, state);
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            String redirectUrl = String.format(
                "%s?token=%s&userId=%d&username=%s&state=%s",
                frontendUrl, token, user.getId(), user.getUsername(), state
            );
            log.info("TikTok success, redirecting to: {}", redirectUrl);
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            log.error("TikTok callback failed", e);
            response.sendRedirect(frontendUrl + "?error=" + e.getMessage());
        }
    }

    // ⭐ NEW: Next.js /auth/me endpoint (CRITICAL)
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            String token = authHeader.substring(7);
            Claims claims = jwtUtil.getClaimsFromToken(token);
            Long userId = claims.get("userId", Long.class);
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            return ResponseEntity.ok(new UserDto(user));
        } catch (Exception e) {
            log.error("Failed to get current user", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "AI Seduction Backend ready");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/first-user")
    public ResponseEntity<?> getFirstUser() {
        try {
            var firstUser = userRepository.findAll().stream().findFirst();
            if (firstUser.isPresent()) {
                User user = firstUser.get();
                String token = jwtUtil.generateToken(user.getUsername(), user.getId());
                return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No users found"));
        } catch (Exception e) {
            log.error("Error getting first user", e);
            throw new RuntimeException("Failed to get first user", e);
        }
    }
}
