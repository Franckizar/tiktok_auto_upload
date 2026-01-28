package com.aiSeduction.demo.dto;

import com.aiSeduction.demo.User;

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
    
    // ⭐ ADD THESE - IDE WILL STOP COMPLAINING
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isTiktokConnected() { return tiktokConnected; }
    public void setTiktokConnected(boolean tiktokConnected) { this.tiktokConnected = tiktokConnected; }
}
