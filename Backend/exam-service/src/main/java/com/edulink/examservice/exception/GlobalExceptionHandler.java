package com.edulink.examservice.exception;

import com.edulink.examservice.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the exam service.
 * Centralizes error handling across all controllers.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle validation errors from @Valid annotation.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        logger.warn("Validation error: {}", errors);
        
        ApiResponse<Map<String, String>> response = ApiResponse.builder()
                .success(false)
                .message("Validation failed")
                .data(errors)
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle resource not found exceptions.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        logger.warn("Resource not found: {}", ex.getMessage());
        
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handle validation exceptions.
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(
            ValidationException ex, WebRequest request) {
        
        logger.warn("Validation error: {}", ex.getMessage());
        
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle unauthorized exceptions.
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {
        
        logger.warn("Unauthorized access attempt: {}", ex.getMessage());
        
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    /**
     * Handle all other exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(
            Exception ex, WebRequest request) {
        
        logger.error("Unexpected error occurred: ", ex);
        
        ApiResponse<Object> response = ApiResponse.error("An unexpected error occurred. Please try again later.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle illegal argument exceptions.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        logger.warn("Invalid argument: {}", ex.getMessage());
        
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle runtime exceptions.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        
        logger.error("Runtime exception occurred: ", ex);
        
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage() != null ? 
            ex.getMessage() : "An error occurred while processing your request");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle invalid grade exceptions (HTTP 400).
     */
    @ExceptionHandler(InvalidGradeException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidGradeException(
            InvalidGradeException ex, WebRequest request) {
        
        logger.warn("Invalid grade provided: {}", ex.getProvidedGrade());
        
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("grade", "Invalid grade: " + ex.getProvidedGrade());
        errorDetails.put("validGrades", ex.getValidGrades());
        errorDetails.put("message", "Grade must be one of: A, B, C, D, E, or F");
        
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Invalid grade submission")
                .data(errorDetails)
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle invalid exam creation exceptions (HTTP 400).
     */
    @ExceptionHandler(InvalidExamException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidExamException(
            InvalidExamException ex, WebRequest request) {
        
        logger.warn("Invalid exam creation: {}", ex.getMessage());
        
        Map<String, String> errorDetails = new HashMap<>();
        if (ex.getExamCode() != null) {
            errorDetails.put("examCode", ex.getExamCode());
        }
        if (ex.getReason() != null) {
            errorDetails.put("reason", ex.getReason());
        }
        
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Invalid exam creation")
                .data(errorDetails)
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle access denied exceptions (HTTP 403).
     * Thrown when Student tries to create exam or Teacher tries to access student grades.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        
        logger.warn("Access denied: {}", ex.getMessage());
        
        Map<String, String> errorDetails = new HashMap<>();
        if (ex.getUserRole() != null) {
            errorDetails.put("userRole", ex.getUserRole());
        }
        if (ex.getEndpoint() != null) {
            errorDetails.put("endpoint", ex.getEndpoint());
        }
        if (ex.getRequiredRole() != null) {
            errorDetails.put("requiredRole", ex.getRequiredRole());
        }
        
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Access Denied: Insufficient permissions")
                .data(errorDetails)
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}
