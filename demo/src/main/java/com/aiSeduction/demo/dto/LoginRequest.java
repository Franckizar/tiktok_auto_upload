// src/main/java/com/aiSeduction/demo/dto/LoginRequest.java  
package com.aiSeduction.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank @Email String email;
    @NotBlank String password;
}
