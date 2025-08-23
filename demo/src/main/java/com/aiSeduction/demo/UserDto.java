package com.aiSeduction.demo;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String email;
    private String username;
    private String role;
    private boolean tiktokConnected;
    
    public UserDto(User user) {
        this.id = user.getId().toString();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.role = user.getRole().toString().toLowerCase();
        this.tiktokConnected = user.isTiktokConnected();
    }}