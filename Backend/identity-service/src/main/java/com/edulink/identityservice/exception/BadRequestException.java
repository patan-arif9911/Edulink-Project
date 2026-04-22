package com.edulink.identityservice.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends EduLinkException {
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException() {
        super("Bad request", HttpStatus.BAD_REQUEST);
    }
}
