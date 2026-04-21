package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNotificationRequest {
    @NotBlank
    private String message;
    @NotBlank
    private String userId;
    @NotNull
    private NotificationType type;
}
