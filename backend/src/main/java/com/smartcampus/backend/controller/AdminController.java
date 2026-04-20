package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UpdateUserRoleRequest;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;

    @PostMapping("/bookings/{bookingId}/approve")
    @PreAuthorize("@securityUtils.hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> approveBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(Map.of(
                "message", "Booking approved by admin",
                "bookingId", bookingId
        ));
    }

    @GetMapping("/users")
    @PreAuthorize("@securityUtils.hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("@securityUtils.hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(userService.updateRole(userId, request.getRole()));
    }
}
