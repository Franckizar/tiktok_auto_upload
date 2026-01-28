package com.aiSeduction.demo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User authenticateUser(String email, String password) {
        log.info("Authenticating user with email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.error("User not found for email: {}", email);
                return new RuntimeException("User not found");
            });
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.error("Invalid password for email: {}", email);
            throw new RuntimeException("Invalid password");
        }
        
        log.info("User authenticated successfully: {}", user.getId());
        return user;
    }
    
    public User registerUser(String email, String password, String username) {
        log.info("Registering user: email={}, username={}", email, username);
        
        if (userRepository.existsByEmail(email)) {
            log.error("Email already registered: {}", email);
            throw new RuntimeException("Email already registered");
        }
        
        if (userRepository.existsByUsername(username)) {
            log.error("Username already taken: {}", username);
            throw new RuntimeException("Username already taken");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: id={}, email={}, username={}", 
                savedUser.getId(), email, username);
        
        return savedUser;
    }
}
