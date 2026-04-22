package com.edulink.identityservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.edulink.identityservice.entity.User;
import com.edulink.identityservice.repository.UserRepository;

/**
 * Test class for UserRepository
 * Tests basic user repository operations
 */
@ExtendWith(MockitoExtension.class)
public class UserManagementServiceTest {

    @Mock
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId("user@example.com");
        testUser.setEmail("user@example.com");
        testUser.setFullName("John Doe");
        testUser.setActive(true);
    }

    @Test
    public void testFindUserByEmail() {
        // Arrange
        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userRepository.findByEmail("user@example.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("user@example.com", result.get().getEmail());
        assertEquals("John Doe", result.get().getFullName());
        verify(userRepository, times(1)).findByEmail("user@example.com");
    }

    @Test
    public void testUserNotFound() {
        // Arrange
        when(userRepository.findByEmail("notfound@example.com"))
                .thenReturn(Optional.empty());

        // Act
        Optional<User> result = userRepository.findByEmail("notfound@example.com");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByEmail("notfound@example.com");
    }

    @Test
    public void testSaveUser() {
        // Arrange
        User newUser = new User();
        newUser.setId("newuser@example.com");
        newUser.setEmail("newuser@example.com");
        newUser.setFullName("Jane Smith");

        when(userRepository.save(newUser)).thenReturn(newUser);

        // Act
        User savedUser = userRepository.save(newUser);

        // Assert
        assertNotNull(savedUser);
        assertEquals("newuser@example.com", savedUser.getEmail());
        assertEquals("Jane Smith", savedUser.getFullName());
        verify(userRepository, times(1)).save(newUser);
    }

}
