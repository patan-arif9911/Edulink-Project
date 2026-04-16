package com.edulink.notificationservice.service;

import com.edulink.notificationservice.entity.Notification;
import com.edulink.notificationservice.exception.InvalidNotificationException;
import com.edulink.notificationservice.exception.NotificationNotFoundException;
import com.edulink.notificationservice.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public Notification sendNotification(Notification notification) {
        validateNotification(notification);
        if (notification.getScheduledAt() == null) {
            notification.setScheduledAt(LocalDateTime.now());
        }
        notification.setDelivered(true);
        return repository.save(notification);
    }

    public Notification scheduleNotification(Notification notification) {
        validateNotification(notification);
        if (notification.getScheduledAt() == null) {
            throw new InvalidNotificationException("Scheduled notification must include a scheduledAt timestamp");
        }
        notification.setDelivered(false);
        return repository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String username, Object authDetails) {
        List<Notification> notifications = repository.findByRecipientEmailAndReadStatusFalse(username);
        if (notifications.isEmpty() && authDetails != null) {
            notifications = repository.findByRecipientIdAndReadStatusFalse(String.valueOf(authDetails));
        }
        return notifications;
    }

    public Notification markAsRead(Long id) {
        return repository.findById(id)
                .map(notification -> {
                    notification.setReadStatus(true);
                    return repository.save(notification);
                })
                .orElseThrow(() -> new NotificationNotFoundException("Notification with id " + id + " not found"));
    }

    public List<Notification> getDueScheduledNotifications(LocalDateTime time) {
        return repository.findByDeliveredFalseAndScheduledAtBefore(time);
    }

    public Notification deliverScheduledNotification(Notification notification) {
        notification.setDelivered(true);
        return repository.save(notification);
    }

    private void validateNotification(Notification notification) {
        if (notification == null) {
            throw new InvalidNotificationException("Notification payload must not be null");
        }
        if (notification.getRecipientEmail() == null || notification.getRecipientEmail().trim().isEmpty()) {
            throw new InvalidNotificationException("Recipient email is required");
        }
        String email = notification.getRecipientEmail().trim();
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new InvalidNotificationException("Recipient email is invalid");
        }
        if (notification.getTitle() == null || notification.getTitle().trim().isEmpty()) {
            throw new InvalidNotificationException("Notification title is required");
        }
    }
}
