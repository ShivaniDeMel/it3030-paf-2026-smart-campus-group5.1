package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.UserRole;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User upsertOAuthUser(OAuth2User principal) {
        String email = principal.getAttribute("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("OAuth user email is missing");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = User.builder()
                .email(email)
                .firstName(principal.getAttribute("given_name"))
                .lastName(principal.getAttribute("family_name"))
                .role(UserRole.USER)
                .build();

        return userRepository.save(newUser);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateRole(String userId, UserRole role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User bootstrapAdmin(String email) {
        if (userRepository.existsByRole(UserRole.ADMIN)) {
            throw new IllegalStateException("An admin user already exists");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setRole(UserRole.ADMIN);
        return userRepository.save(user);
    }

    public User updateProfile(String email, String firstName, String lastName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        return userRepository.save(user);
    }
}
