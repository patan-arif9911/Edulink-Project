package com.edulink.notificationservice.controller;
import com.edulink.notificationservice.dto.ApiResponse;
import com.edulink.notificationservice.entity.Notification;
import com.edulink.notificationservice.service.NotificationService;
import com.edulink.notificationservice.exception.InvalidNotificationException;
import com.edulink.notificationservice.exception.NotificationNotFoundException;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('TEACHER','SCHOOL_ADMIN')")
    public ResponseEntity<ApiResponse<Notification>> sendNotification(@Valid @RequestBody Notification notification) {
        log.info("Sending notification to: {} (id: {}, role: {})", notification.getRecipientEmail(), notification.getRecipientId(), notification.getRecipientRole());
        Notification saved = notificationService.sendNotification(notification);
        log.info("Notification saved with id: {}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notification sent", saved));
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasAnyRole('TEACHER','SCHOOL_ADMIN')")
    public ResponseEntity<ApiResponse<Notification>> scheduleNotification(@Valid @RequestBody Notification notification) {
        log.info("Scheduling notification for {} at {}", notification.getRecipientEmail(), notification.getScheduledAt());
        Notification scheduled = notificationService.scheduleNotification(notification);
        log.info("Notification scheduled with id: {}", scheduled.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notification scheduled", scheduled));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication auth) {
        log.info("Fetching notifications for user: {}", auth.getName());
        List<Notification> notifications = notificationService.getNotificationsForUser(auth.getName(), auth.getDetails());
        log.info("Found {} notifications for user {}", notifications.size(), auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Notifications", notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Marked as read", notificationService.markAsRead(id)));
    }
}
