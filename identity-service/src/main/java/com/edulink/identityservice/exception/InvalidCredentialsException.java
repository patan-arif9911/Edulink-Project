package com.edulink.identityservice.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends EduLinkException {
    public InvalidCredentialsException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public InvalidCredentialsException() {
        super("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
}
