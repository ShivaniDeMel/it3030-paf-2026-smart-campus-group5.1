package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private String confirmPassword;
    private User.UserRole userRole = User.UserRole.STUDENT;
    private Boolean agreeToTerms = false;
}
