package com.smartcampus.backend.security;

import com.smartcampus.backend.model.UserRole;
import com.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component("securityUtils")
@RequiredArgsConstructor
public class SecurityUtils {
    private final UserService userService;

    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User principal)) {
            return false;
        }

        String email = principal.getAttribute("email");
        if (email == null) {
            return false;
        }

        return userService.findByEmail(email)
                .map(user -> user.getRole() == UserRole.valueOf(role))
                .orElse(false);
    }
}
