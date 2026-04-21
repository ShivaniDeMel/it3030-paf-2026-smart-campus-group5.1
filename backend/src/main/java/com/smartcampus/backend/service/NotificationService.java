package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.CreateNotificationRequest;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<Notification> getByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Notification create(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .message(request.getMessage())
                .userId(request.getUserId())
                .type(request.getType())
                .isRead(false)
                .timestamp(Instant.now())
                .build();
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void delete(String id) {
        notificationRepository.deleteById(id);
    }
}
