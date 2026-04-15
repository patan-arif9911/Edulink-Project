package com.edulink.studentservice.exception;

public class StudentNotEnrolledInCourseException extends RuntimeException {

    public StudentNotEnrolledInCourseException(String email, Long courseId) {
        super("Student " + email + " is not enrolled in courseId " + courseId);
    }

    public StudentNotEnrolledInCourseException(String email, String courseCode) {
        super("Student " + email + " is not enrolled in course " + courseCode);
    }
}

