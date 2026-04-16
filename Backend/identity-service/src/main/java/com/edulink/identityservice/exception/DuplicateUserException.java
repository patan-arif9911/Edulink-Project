package com.edulink.identityservice.exception;

import org.springframework.http.HttpStatus;

public class DuplicateUserException extends EduLinkException {
    public DuplicateUserException(String message) {
        super(message, HttpStatus.CONFLICT);
    }

    public DuplicateUserException() {
        super("User already exists", HttpStatus.CONFLICT);
    }
}
