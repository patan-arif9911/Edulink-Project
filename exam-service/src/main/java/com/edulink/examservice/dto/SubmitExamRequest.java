package com.edulink.examservice.dto;

/**
 * Request DTO for submitting an exam
 */
public class SubmitExamRequest {

    private String courseCode;

    private String submissionContent;

    // Constructors
    public SubmitExamRequest() {}

    public SubmitExamRequest(String courseCode, String submissionContent) {
        this.courseCode = courseCode;
        this.submissionContent = submissionContent;
    }

    // Getters and Setters
    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getSubmissionContent() {
        return submissionContent;
    }

    public void setSubmissionContent(String submissionContent) {
        this.submissionContent = submissionContent;
    }
}