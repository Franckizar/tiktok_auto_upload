package com.aiSeduction.demo;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private boolean tiktokConnected;
    
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.tiktokConnected = user.isTiktokConnected();
    }
}
