package com.aiSeduction.demo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private boolean tiktokConnected;
    
    // ✅ NEW: Include TikTok profile fields
    private String displayName;
    private String avatarUrl;
    private String tiktokId;
    
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.tiktokConnected = user.isTiktokConnected();
        this.displayName = user.getDisplayName();
        this.avatarUrl = user.getAvatarUrl();
        this.tiktokId = user.getTiktokId();
    }
}