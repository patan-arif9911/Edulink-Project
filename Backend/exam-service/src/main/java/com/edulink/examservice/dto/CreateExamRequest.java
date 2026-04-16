package com.edulink.examservice.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Request DTO for creating an exam with validation annotations.
 */
public class CreateExamRequest {

    @NotBlank(message = "Course code is required")
    @Size(min = 2, max = 50, message = "Course code must be between 2 and 50 characters")
    private String courseCode;

    @NotBlank(message = "Exam title is required")
    @Size(min = 3, max = 100, message = "Exam title must be between 3 and 100 characters")
    private String examTitle;

    @NotBlank(message = "Exam type is required")
    @Pattern(regexp = "^(MIDTERM|FINAL|QUIZ|ASSIGNMENT)$", message = "Exam type must be MIDTERM, FINAL, QUIZ, or ASSIGNMENT")
    private String examType;

    @Positive(message = "Total marks must be greater than 0")
    @Max(value = 1000, message = "Total marks cannot exceed 1000")
    private int totalMarks;

    @PositiveOrZero(message = "Passing marks must be 0 or greater")
    @DecimalMin(value = "0", message = "Passing marks must be at least 0")
    private int passingMarks;

    @NotBlank(message = "School ID is required")
    @Size(min = 1, max = 50, message = "School ID must be between 1 and 50 characters")
    private String schoolId;

    @NotNull(message = "Exam date is required")
    @FutureOrPresent(message = "Exam date must be in the present or future")
    private LocalDateTime examDate;

    // Constructors
    public CreateExamRequest() {}

    public CreateExamRequest(String courseCode, String examTitle, String examType, 
                            int totalMarks, int passingMarks, String schoolId, 
                            LocalDateTime examDate) {
        this.courseCode = courseCode;
        this.examTitle = examTitle;
        this.examType = examType;
        this.totalMarks = totalMarks;
        this.passingMarks = passingMarks;
        this.schoolId = schoolId;
        this.examDate = examDate;
    }

    // Getters and Setters
    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public int getPassingMarks() {
        return passingMarks;
    }

    public void setPassingMarks(int passingMarks) {
        this.passingMarks = passingMarks;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public LocalDateTime getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDateTime examDate) {
        this.examDate = examDate;
    }
}

