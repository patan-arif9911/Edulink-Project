package com.edulink.studentservice.exception;

public class StudentProfileNotFoundException extends RuntimeException {

    public StudentProfileNotFoundException(String identifierType, String identifierValue) {
        super("Student profile not found for " + identifierType + ": " + identifierValue);
    }
}

