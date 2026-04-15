package com.edulink.examservice.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for submitting an exam
 */
public class SubmitExamRequest {

    @NotBlank(message = "Exam ID is required")
    private String examId;

    private String submissionContent;

    // Constructors
    public SubmitExamRequest() {}

    public SubmitExamRequest(String examId, String submissionContent) {
        this.examId = examId;
        this.submissionContent = submissionContent;
    }

    // Getters and Setters
    public String getExamId() {
        return examId;
    }

    public void setExamId(String examId) {
        this.examId = examId;
    }

    public String getSubmissionContent() {
        return submissionContent;
    }

    public void setSubmissionContent(String submissionContent) {
        this.submissionContent = submissionContent;
    }
}