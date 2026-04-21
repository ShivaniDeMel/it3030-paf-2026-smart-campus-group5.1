package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User principal)) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        String email = principal.getAttribute("email");
        User user = userService.findByEmail(email).orElse(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        boolean googleConfigured = googleClientId != null && !googleClientId.isBlank();
        return ResponseEntity.ok(Map.of("googleConfigured", googleConfigured));
    }

    @PostMapping("/bootstrap-admin")
    public ResponseEntity<?> bootstrapAdmin(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User principal)) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        String email = principal.getAttribute("email");
        try {
            User user = userService.bootstrapAdmin(email);
            return ResponseEntity.ok(user);
        } catch (IllegalStateException exception) {
            return ResponseEntity.status(409).body(Map.of("message", exception.getMessage()));
        }
    }
}
