package com.edulink.examservice.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for submitting an exam.
 * examType is required so the submission is attached to the correct exam
 * when a course has multiple exams of different types (MIDTERM, FINAL, QUIZ, ASSIGNMENT).
 */
public class SubmitExamRequest {

    @NotBlank(message = "courseCode is required")
    private String courseCode;

    @NotBlank(message = "examType is required (MIDTERM, FINAL, QUIZ, ASSIGNMENT)")
    private String examType;

    @NotBlank(message = "submissionContent is required")
    private String submissionContent;

    public SubmitExamRequest() {}

    public SubmitExamRequest(String courseCode, String examType, String submissionContent) {
        this.courseCode = courseCode;
        this.examType = examType;
        this.submissionContent = submissionContent;
    }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getSubmissionContent() { return submissionContent; }
    public void setSubmissionContent(String submissionContent) { this.submissionContent = submissionContent; }
}
