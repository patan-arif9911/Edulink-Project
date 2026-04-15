package com.edulink.examservice.exception;

/**
 * Exception thrown when an exam cannot be created due to invalid data.
 * For example: course not found, invalid marks, etc.
 */
public class InvalidExamException extends RuntimeException {
    
    private String examCode;
    private String reason;

    public InvalidExamException(String message) {
        super(message);
    }

    public InvalidExamException(String examCode, String reason) {
        super("Cannot create exam " + examCode + ": " + reason);
        this.examCode = examCode;
        this.reason = reason;
    }

    public InvalidExamException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getExamCode() {
        return examCode;
    }

    public String getReason() {
        return reason;
    }
}

