// src/main/java/com/aiSeduction/demo/dto/RegisterRequest.java
package com.aiSeduction.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email String email;
    @NotBlank String username;
    @NotBlank String password;
}
