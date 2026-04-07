package com.smartcampus.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Field("first_name")
    private String firstName;
    
    @Field("last_name")
    private String lastName;
    
    @Field("email")
    private String email;
    
    @Field("phone")
    private String phone;
    
    @Field("password")
    private String password;
    
    @Field("role")
    private UserRole role;
    
    @Field("is_active")
    private Boolean isActive = true;
    
    @Field("is_verified")
    private Boolean isVerified = false;
    
    @Field("last_login")
    private LocalDateTime lastLogin;
    
    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    public enum UserRole {
        STUDENT,
        STAFF,
        FACULTY,
        ADMIN
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
