package com.edulink.studentservice.exception;

public class CourseNotFoundException extends RuntimeException {

    public CourseNotFoundException(String courseCode) {
        super("Course not found for courseCode: " + courseCode);
    }
}

