package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.AuthResponse;
import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.dto.RegisterRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class AuthServiceJPA {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
            // Find user by email
            User user = userRepository.findByEmailAndIsActive(loginRequest.getEmail(), true)
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
            
            System.out.println("Found user: " + user.getEmail() + ", ID: " + user.getId());
            
            // Check password
            if (!checkPassword(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("Password check failed for user: " + user.getEmail());
                throw new RuntimeException("Invalid email or password");
            }
            
            System.out.println("Password verified for user: " + user.getEmail());
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("Updated last login for user: " + user.getEmail());
            
            // Generate JWT token (simplified for demo)
            String token = generateToken(user);
            System.out.println("Generated token for user: " + user.getEmail());
            
            // Create response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    user.getId().toString(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().toString(),
                    user.getIsActive(),
                    user.getIsVerified()
            );
            
            System.out.println("Login successful for user: " + user.getEmail());
            return new AuthResponse(token, "Bearer", 3600L, userInfo);
        } catch (RuntimeException e) {
            System.out.println("Login error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Unexpected login error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            System.out.println("Registration attempt for email: " + registerRequest.getEmail());
            System.out.println("User data: " + registerRequest.getFirstName() + " " + registerRequest.getLastName());
            
            // Validate passwords match
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                System.out.println("Password mismatch error");
                throw new RuntimeException("Passwords do not match");
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                System.out.println("Email already exists: " + registerRequest.getEmail());
                throw new RuntimeException("Email already exists");
            }
            
            // Check if phone already exists
            if (userRepository.existsByPhone(registerRequest.getPhone())) {
                System.out.println("Phone already exists: " + registerRequest.getPhone());
                throw new RuntimeException("Phone number already exists");
            }
            
            // Create new user
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setEmail(registerRequest.getEmail());
            user.setPhone(registerRequest.getPhone());
            user.setPassword(encodePassword(registerRequest.getPassword()));
            user.setRole(convertUserRole(registerRequest.getUserRole()));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            
            System.out.println("Saving user to database...");
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            // Generate JWT token
            String token = generateToken(savedUser);
            System.out.println("Generated token: " + token);
            
            // Create response
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    savedUser.getId().toString(),
                    savedUser.getFirstName(),
                    savedUser.getLastName(),
                    savedUser.getEmail(),
                    savedUser.getPhone(),
                    savedUser.getRole().toString(),
                    savedUser.getIsActive(),
                    savedUser.getIsVerified()
            );
            
            System.out.println("Registration successful for user: " + savedUser.getEmail());
            return new AuthResponse(token, "Bearer", 3600L, userInfo);
        } catch (RuntimeException e) {
            System.out.println("Registration error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Unexpected registration error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
    
    private User.UserRole convertUserRole(com.smartcampus.backend.entity.User.UserRole mongoRole) {
        if (mongoRole == null) return User.UserRole.STUDENT;
        return User.UserRole.valueOf(mongoRole.name());
    }
    
    private String encodePassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error encoding password", e);
        }
    }
    
    private boolean checkPassword(String rawPassword, String encodedPassword) {
        return encodePassword(rawPassword).equals(encodedPassword);
    }
    
    private String generateToken(User user) {
        // Simplified token generation for demo
        // In production, use proper JWT library
        return "demo-token-" + UUID.randomUUID().toString() + "-" + user.getId();
    }
    
    public boolean validateToken(String token) {
        // Simplified token validation for demo
        // In production, use proper JWT validation
        return token != null && token.startsWith("demo-token-");
    }
}
