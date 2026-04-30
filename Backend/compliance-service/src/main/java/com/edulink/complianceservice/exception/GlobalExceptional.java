package com.edulink.complianceservice.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import org.springframework.security.core.AuthenticationException;

//import javax.naming.AuthenticationException;
//import javax.naming.ServiceUnavailableException;


@RestControllerAdvice
public class GlobalExceptional{

    private static final Logger logger= LoggerFactory.getLogger(GlobalExceptional.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceFoundException(ResourceNotFoundException e){
        logger.error("Resource not available {}",e.getMessage());
        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceNotCreateException.class)
    public ResponseEntity<String> handleResourceCreateException(ResourceNotCreateException e){
        logger.error("Resource not create {}",e.getMessage());
        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RoleException.class)
    public ResponseEntity<String> handleRoleException(RoleException e){
        logger.error("Role not valid  {}",e.getMessage());
        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleAuthenticationException(AuthenticationException e){
        logger.error("Authentication Failed {}",e.getMessage());
        ProblemDetail errorDetail=ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN,e.getMessage());
        errorDetail.setProperty("Token Not Valid","Authentication Failed");
        return errorDetail;
    }

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<String> handleServiceUnavailableException(ServiceUnavailableException e){
        logger.error("Server under Maintenance {}",e.getMessage());
        return new ResponseEntity<>("Server under Maintenance ",HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        logger.error("Argument not Valid {}",e.getMessage());
        return new ResponseEntity<>("Argument not Valid "+e.getMessage(),HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<String> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e){
        logger.error("This method is not valid at this End-point {}",e.getMessage());
        return new ResponseEntity<>("This method is not valid at this End-point "+e.getMessage(),HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception e){
        logger.error("Token in valid {}",e.getMessage());
        return new ResponseEntity<>("Token Not Valid "+e.getMessage(),HttpStatus.FORBIDDEN);
    }
}
