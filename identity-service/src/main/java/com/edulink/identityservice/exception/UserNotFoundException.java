package com.edulink.identityservice.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends EduLinkException {
    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public UserNotFoundException() {
        super("User not found", HttpStatus.NOT_FOUND);
    }
}
