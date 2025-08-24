package com.aiSeduction.demo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final TikTokService tiktokService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

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

    @GetMapping("/tiktok")
    public ResponseEntity<String> getTikTokAuthUrl() {
        log.info("Request for TikTok auth URL");
        try {
            String authUrl = tiktokService.getTikTokAuthUrl();
            log.info("Returning TikTok auth URL");
            return ResponseEntity.ok(authUrl);
        } catch (Exception e) {
            log.error("Failed to generate TikTok auth URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate authentication URL");
        }
    }

    @GetMapping("/tiktok/callback")
    public ResponseEntity<?> handleTikTokCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false) String error_description,
            HttpServletRequest request) {

        log.info("TikTok callback received - code: {}, state: {}, error: {}, error_description: {}", 
                code, state, error, error_description);

        // Handle TikTok errors first - but continue with hardcoded user for testing
        if (error != null && "access_denied".equals(error)) {
            log.warn("TikTok returned access_denied - Using hardcoded user for testing");
            // Continue with hardcoded user creation despite the error
        } else if (error != null) {
            log.error("TikTok authorization error: {} - {}", error, error_description);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", error);
            errorResponse.put("error_description", error_description);
            errorResponse.put("timestamp", LocalDateTime.now());
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (code == null || code.isBlank()) {
            log.warn("Missing authorization code - Using hardcoded flow for testing");
            // Continue with hardcoded user creation
        }

        if (state == null || state.isBlank()) {
            log.warn("Missing state parameter - Using hardcoded flow for testing");
            // Continue with hardcoded user creation
        }

        try {
            User user = tiktokService.handleTikTokCallback(code, state);
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            log.info("Successful TikTok login for user: {}", user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", new UserDto(user));
            response.put("message", "Logged in with hardcoded TikTok user (actual API returned access_denied)");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to handle TikTok callback", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "authentication_failed");
            errorResponse.put("message", "Failed to authenticate with TikTok");
            errorResponse.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Add endpoint to get first user for testing
    @GetMapping("/first-user")
    public ResponseEntity<?> getFirstUser() {
        try {
            Optional<User> firstUser = userRepository.findAll().stream().findFirst();
            if (firstUser.isPresent()) {
                User user = firstUser.get();
                String token = jwtUtil.generateToken(user.getUsername(), user.getId());
                return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No users found in database");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            log.error("Error getting first user", e);
            throw new RuntimeException("Failed to get first user", e);
        }
    }
}