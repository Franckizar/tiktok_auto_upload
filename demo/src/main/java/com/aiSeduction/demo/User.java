package com.aiSeduction.demo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    @Column(unique = true)
    private String username;
    
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    private String tiktokId;
    private String tiktokUsername;
    private String tiktokAccessToken;
    private String tiktokRefreshToken;
    private LocalDateTime tiktokTokenExpiry;
    private boolean tiktokConnected = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum Role {
        USER, ADMIN
    }
}
