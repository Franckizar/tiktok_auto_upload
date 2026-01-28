package com.aiSeduction.demo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {
    
    @Value("${jwt.secret:mySecretKey123456789012345678901234567890}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}")
    private int jwtExpiration;
    
    private SecretKey getSigningKey() {
        log.debug("Generating JWT signing key");
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateToken(String username, Long userId) {
        log.info("Generating JWT for username: {}, userId: {}", username, userId);
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        String token = Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
        
        log.info("JWT generated successfully for userId: {}", userId);
        return token;
    }
    
    public Claims getClaimsFromToken(String token) {
        log.debug("Extracting claims from JWT token");
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            log.debug("Claims extracted successfully");
            return claims;
        } catch (JwtException e) {
            log.error("Failed to extract claims from token", e);
            throw e;
        }
    }
    
    public String getUsernameFromToken(String token) {
        log.debug("Extracting username from token");
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            String username = claims.getSubject();
            log.debug("Username extracted: {}", username);
            return username;
        } catch (JwtException e) {
            log.error("Failed to extract username from token", e);
            throw e;
        }
    }
    
    public Long getUserIdFromToken(String token) {
        log.debug("Extracting userId from token");
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            Long userId = claims.get("userId", Long.class);
            log.debug("UserId extracted: {}", userId);
            return userId;
        } catch (JwtException e) {
            log.error("Failed to extract userId from token", e);
            throw e;
        }
    }
    
    public boolean validateToken(String token) {
        log.debug("Validating JWT token");
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            log.debug("Token validation successful");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Token validation failed", e);
            return false;
        }
    }
}
