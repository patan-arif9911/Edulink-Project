package com.edulink.examservice.exception;

/**
 * Exception thrown when an invalid grade is provided.
 * Grade must be A, B, C, D, E, or F.
 */
public class InvalidGradeException extends RuntimeException {
    
    private String providedGrade;
    private static final String VALID_GRADES = "A, B, C, D, E, F";

    public InvalidGradeException(String message) {
        super(message);
    }

    public InvalidGradeException(String providedGrade, String message) {
        super(message);
        this.providedGrade = providedGrade;
    }

    public InvalidGradeException(String providedGrade, Throwable cause) {
        super("Invalid grade: " + providedGrade + ". Valid grades are: " + VALID_GRADES, cause);
        this.providedGrade = providedGrade;
    }

    public String getProvidedGrade() {
        return providedGrade;
    }

    public String getValidGrades() {
        return VALID_GRADES;
    }
}

