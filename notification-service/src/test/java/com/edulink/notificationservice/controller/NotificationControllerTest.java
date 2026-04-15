package com.edulink.notificationservice.controller;

import com.edulink.notificationservice.entity.Notification;
import com.edulink.notificationservice.exception.InvalidNotificationException;
import com.edulink.notificationservice.exception.NotificationNotFoundException;
import com.edulink.notificationservice.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationRepository repo;

    @InjectMocks
    private NotificationController controller;

    @Test
    void sendNotification_nullPayload_throwsInvalidNotificationException() {
        assertThrows(InvalidNotificationException.class, () -> controller.sendNotification(null));
    }

    @Test
    void sendNotification_emptyEmail_throwsInvalidNotificationException() {
        Notification notification = new Notification();
        notification.setRecipientEmail(" ");
        notification.setTitle("Valid Title");
        notification.setMessage("message");
        notification.setType("INFO");

        InvalidNotificationException ex = assertThrows(InvalidNotificationException.class, () -> controller.sendNotification(notification));
        assertEquals("Recipient email is required", ex.getMessage());
    }

    @Test
    void sendNotification_invalidEmailFormat_throwsInvalidNotificationException() {
        Notification notification = new Notification();
        notification.setRecipientEmail("not-an-email");
        notification.setTitle("Valid Title");
        notification.setMessage("message");
        notification.setType("INFO");

        InvalidNotificationException ex = assertThrows(InvalidNotificationException.class, () -> controller.sendNotification(notification));
        assertEquals("Recipient email is invalid", ex.getMessage());
    }

    @Test
    void sendNotification_emptyTitle_throwsInvalidNotificationException() {
        Notification notification = new Notification();
        notification.setRecipientEmail("test@example.com");
        notification.setTitle(" ");
        notification.setMessage("message");
        notification.setType("INFO");

        InvalidNotificationException ex = assertThrows(InvalidNotificationException.class, () -> controller.sendNotification(notification));
        assertEquals("Notification title is required", ex.getMessage());
    }

    @Test
    void sendNotification_validNotification_returnsCreatedResponse() {
        Notification notification = new Notification();
        notification.setRecipientEmail("test@example.com");
        notification.setTitle("Valid Title");
        notification.setMessage("message");
        notification.setType("INFO");

        Notification saved = new Notification();
        saved.setId(1L);
        saved.setRecipientEmail("test@example.com");
        saved.setTitle("Valid Title");
        saved.setMessage("message");
        saved.setType("INFO");
        when(repo.save(any(Notification.class))).thenReturn(saved);

        ResponseEntity<?> response = controller.sendNotification(notification);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void markRead_nonExistingId_throwsNotificationNotFoundException() {
        when(repo.findById(42L)).thenReturn(Optional.empty());

        NotificationNotFoundException ex = assertThrows(NotificationNotFoundException.class, () -> controller.markRead(42L));
        assertEquals("Notification with id 42 not found", ex.getMessage());
    }
}
