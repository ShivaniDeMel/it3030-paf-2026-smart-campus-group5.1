package com.smartcampus.service;

import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.ResourceAlreadyExistsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }
        if (user.getStudentId() != null && userRepository.existsByStudentId(user.getStudentId())) {
            throw new ResourceAlreadyExistsException("Student ID already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(@Nonnull String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(@Nonnull String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(@Nonnull String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getUsersByRole(@Nonnull String role) {
        return userRepository.findByRoleAndIsActive(role);
    }
    
    public List<User> getUsersByDepartment(@Nonnull String department) {
        return userRepository.findByDepartmentAndIsActive(department);
    }
    
    @Transactional
    @SuppressWarnings("type.uncertainty")
    public @Nullable User updateUser(@Nonnull String id, @Nonnull User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (userDetails.getUsername() != null && !userDetails.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDetails.getUsername())) {
                throw new ResourceAlreadyExistsException("Username already exists");
            }
            user.setUsername(userDetails.getUsername());
        }
        
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new ResourceAlreadyExistsException("Email already exists");
            }
            user.setEmail(userDetails.getEmail());
        }
        
        if (userDetails.getFirstName() != null) {
            user.setFirstName(userDetails.getFirstName());
        }
        
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        
        if (userDetails.getDepartment() != null) {
            user.setDepartment(userDetails.getDepartment());
        }
        
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }
        
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        
        if (userDetails.getStudentId() != null && !userDetails.getStudentId().equals(user.getStudentId())) {
            if (userRepository.existsByStudentId(userDetails.getStudentId())) {
                throw new ResourceAlreadyExistsException("Student ID already exists");
            }
            user.setStudentId(userDetails.getStudentId());
        }
        
        User result = userRepository.save(user);
        return result;
    }
    
    @Transactional
    public void deleteUser(@Nonnull String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    public boolean authenticateUser(@Nonnull String identifier, @Nonnull String password) {
        // Try by username first, then by email
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByEmail(identifier);
        }
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword()) && user.getIsActive();
        }
        return false;
    }
    
    @Transactional
    public void enrollCourse(@Nonnull String userId, @Nonnull String courseId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<String> enrolledCourses = user.getEnrolledCourses();
        if (enrolledCourses == null) {
            enrolledCourses = new ArrayList<>();
            user.setEnrolledCourses(enrolledCourses);
        }
        
        if (!enrolledCourses.contains(courseId)) {
            enrolledCourses.add(courseId);
        }
        
        userRepository.save(user);
    }
    
    @Transactional
    public void dropCourse(@Nonnull String userId, @Nonnull String courseId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<String> enrolledCourses = user.getEnrolledCourses();
        if (enrolledCourses != null) {
            enrolledCourses.remove(courseId);
        }
        
        userRepository.save(user);
    }
}
