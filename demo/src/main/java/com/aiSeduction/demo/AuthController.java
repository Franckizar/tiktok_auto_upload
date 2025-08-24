package com.aiSeduction.demo;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final TikTokService tiktokService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticateUser(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.registerUser(request.getEmail(), request.getPassword(), request.getUsername());
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
    }

    @GetMapping("/tiktok")
    public ResponseEntity<String> getTikTokAuthUrl() {
        String authUrl = tiktokService.getTikTokAuthUrl();
        return ResponseEntity.ok(authUrl);
    }

    @GetMapping("/tiktok/callback")
    public ResponseEntity<AuthResponse> handleTikTokCallback(
            @RequestParam String code,
            @RequestParam(required = false) String state) {
        User user = tiktokService.handleTikTokCallback(code, state);
        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, new UserDto(user)));
    }
}