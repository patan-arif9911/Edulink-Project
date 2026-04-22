package com.edulink.notificationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class NotificationScheduler {
    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);
    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Scheduled(fixedRateString = "${notification.scheduler.fixed-rate-ms:60000}")
    public void triggerScheduledNotifications() {
        List<com.edulink.notificationservice.entity.Notification> dueNotifications = notificationService.getDueScheduledNotifications(LocalDateTime.now());
        if (!dueNotifications.isEmpty()) {
            log.info("Found {} scheduled notifications ready to deliver", dueNotifications.size());
            for (com.edulink.notificationservice.entity.Notification notification : dueNotifications) {
                notificationService.deliverScheduledNotification(notification);
                log.info("Automatically delivered scheduled notification id={} recipient={}", notification.getId(), notification.getRecipientEmail());
            }
        }
    }
}
