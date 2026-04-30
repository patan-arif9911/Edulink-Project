package com.edulink.complianceservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ResourceNotCreateException extends RuntimeException{
    public ResourceNotCreateException(String message){
        super(message);
    }
}
