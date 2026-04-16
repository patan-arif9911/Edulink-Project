package com.edulink.studentservice.exception;

public class StudentAlreadyEnrolledException extends RuntimeException {

    public StudentAlreadyEnrolledException(String email, String courseIdentifier) {
        super("Student " + email + " is already enrolled in course " + courseIdentifier);
    }
}

