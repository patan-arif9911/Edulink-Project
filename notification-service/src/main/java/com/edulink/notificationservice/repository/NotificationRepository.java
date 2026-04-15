package com.edulink.notificationservice.repository;
import com.edulink.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientId(String recipientId);
    List<Notification> findByRecipientEmailAndReadStatusFalse(String email);
    List<Notification> findByRecipientIdAndReadStatusFalse(String recipientId);
    List<Notification> findByDeliveredFalseAndScheduledAtBefore(LocalDateTime dateTime);
}
