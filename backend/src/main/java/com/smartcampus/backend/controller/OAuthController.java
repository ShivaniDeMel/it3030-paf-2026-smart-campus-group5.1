package com.smartcampus.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class OAuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @GetMapping("/auth/google")
    public void startGoogleLogin(HttpServletResponse response) throws IOException {
        if (googleClientId == null || googleClientId.isBlank()) {
            response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
            response.setContentType(MediaType.TEXT_PLAIN_VALUE);
            response.getWriter().write(
                    "Google OAuth is not configured. Set " +
                    "SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID and " +
                    "SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET, " +
                    "then restart the backend."
            );
            return;
        }

        response.sendRedirect("/oauth2/authorization/google");
    }
}
