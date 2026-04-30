package com.edulink.complianceservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.METHOD_NOT_ALLOWED)
public class RoleException extends RuntimeException {
    public RoleException(String message){
        super(message);
    }
}
