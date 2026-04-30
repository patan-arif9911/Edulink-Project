package com.edulink.complianceservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.SERVICE_UNAVAILABLE)
public class ServiceUnavailableException extends Exception {
    public ServiceUnavailableException(String message){
        super(message);
    }
}
