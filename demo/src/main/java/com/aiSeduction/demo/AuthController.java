package com.aiSeduction.demo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all origins for testing - change in production
public class AuthController {

    private final AuthService authService;
    private final TikTokService tiktokService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("=== LOGIN REQUEST ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Login attempt at: " + LocalDateTime.now());
        
        try {
            User user = authService.authenticateUser(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            
            System.out.println("Login successful for user: " + user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
        } catch (Exception e) {
            System.err.println("Login failed: " + e.getMessage());
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("=== REGISTER REQUEST ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Username: " + request.getUsername());
        System.out.println("Registration attempt at: " + LocalDateTime.now());
        
        try {
            User user = authService.registerUser(request.getEmail(), request.getPassword(), request.getUsername());
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            
            System.out.println("Registration successful for user: " + user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/tiktok")
    public ResponseEntity<String> getTikTokAuthUrl() {
        System.out.println("=== TIKTOK AUTH URL REQUEST ===");
        System.out.println("Request time: " + LocalDateTime.now());
        
        try {
            String authUrl = tiktokService.getTikTokAuthUrl();
            System.out.println("TikTok auth URL generated successfully");
            return ResponseEntity.ok(authUrl);
        } catch (Exception e) {
            System.err.println("Failed to generate TikTok auth URL: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/tiktok/callback")
    @CrossOrigin(origins = "*") // Explicit CORS for callback
    public ResponseEntity<?> handleTikTokCallback(
            @RequestParam String code,
            @RequestParam(required = false) String state,
            HttpServletRequest request) {
        
        System.out.println("=== TIKTOK CALLBACK RECEIVED ===");
        System.out.println("Callback time: " + LocalDateTime.now());
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Query String: " + request.getQueryString());
        System.out.println("Remote Address: " + request.getRemoteAddr());
        System.out.println("Remote Host: " + request.getRemoteHost());
        System.out.println("Server Name: " + request.getServerName());
        System.out.println("Server Port: " + request.getServerPort());
        System.out.println("Protocol: " + request.getProtocol());
        
        // Log all headers
        System.out.println("=== REQUEST HEADERS ===");
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            System.out.println(headerName + ": " + request.getHeader(headerName));
        });
        
        // Log parameters
        System.out.println("=== REQUEST PARAMETERS ===");
        System.out.println("code: " + code);
        System.out.println("state: " + state);
        System.out.println("code length: " + (code != null ? code.length() : "null"));
        System.out.println("state length: " + (state != null ? state.length() : "null"));
        
        // Additional parameter logging
        request.getParameterMap().forEach((key, values) -> {
            System.out.println("Param " + key + ": " + String.join(", ", values));
        });
        
        // Validate required parameters
        if (code == null || code.trim().isEmpty()) {
            System.err.println("ERROR: Missing or empty code parameter");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "missing_code");
            errorResponse.put("message", "Authorization code is required");
            errorResponse.put("timestamp", LocalDateTime.now());
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (state == null || state.trim().isEmpty()) {
            System.err.println("ERROR: Missing or empty state parameter");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "missing_state");
            errorResponse.put("message", "State parameter is required");
            errorResponse.put("timestamp", LocalDateTime.now());
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        try {
            System.out.println("Processing TikTok callback...");
            User user = tiktokService.handleTikTokCallback(code, state);
            
            System.out.println("Callback processed successfully, generating JWT token...");
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
            
            System.out.println("JWT token generated successfully");
            System.out.println("Returning successful response for user: " + user.getUsername());
            
            AuthResponse response = new AuthResponse(token, new UserDto(user));
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            System.err.println("=== RUNTIME EXCEPTION IN CALLBACK ===");
            System.err.println("Exception class: " + e.getClass().getSimpleName());
            System.err.println("Exception message: " + e.getMessage());
            System.err.println("Exception cause: " + (e.getCause() != null ? e.getCause().getMessage() : "No cause"));
            e.printStackTrace();
            
            // Return detailed error response for debugging
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "callback_processing_failed");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            errorResponse.put("code_received", code != null);
            errorResponse.put("state_received", state != null);
            
            // Determine appropriate HTTP status
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            if (e.getMessage().contains("Invalid state parameter")) {
                status = HttpStatus.BAD_REQUEST;
                errorResponse.put("error", "invalid_state");
            } else if (e.getMessage().contains("Token exchange failed")) {
                status = HttpStatus.UNAUTHORIZED;
                errorResponse.put("error", "token_exchange_failed");
            }
            
            return ResponseEntity.status(status).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("=== UNEXPECTED EXCEPTION IN CALLBACK ===");
            System.err.println("Exception class: " + e.getClass().getSimpleName());
            System.err.println("Exception message: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "unexpected_error");
            errorResponse.put("message", "An unexpected error occurred: " + e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Test endpoint to verify the server is working
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test(HttpServletRequest request) {
        System.out.println("=== TEST ENDPOINT ACCESSED ===");
        System.out.println("Test request time: " + LocalDateTime.now());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Remote Address: " + request.getRemoteAddr());
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Server is working correctly");
        response.put("timestamp", LocalDateTime.now());
        response.put("server_name", request.getServerName());
        response.put("server_port", request.getServerPort());
        response.put("request_url", request.getRequestURL().toString());
        
        return ResponseEntity.ok(response);
    }
    
    // Debug endpoint to check PKCE storage
    @GetMapping("/debug/storage")
    public ResponseEntity<Map<String, Object>> debugStorage() {
        System.out.println("=== DEBUG STORAGE ENDPOINT ===");
        tiktokService.debugStorage();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Storage debug info printed to console");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}