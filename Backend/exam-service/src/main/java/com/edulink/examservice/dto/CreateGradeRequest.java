package com.edulink.examservice.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for grading a student with validation annotations.
 */
public class CreateGradeRequest {

    @NotBlank(message = "Exam ID is required")
    @Size(min = 1, max = 100, message = "Exam ID must be between 1 and 100 characters")
    private String examId;

    @NotNull(message = "Student ID is required")
    @Positive(message = "Student ID must be greater than 0")
    private Long studentId;

    @PositiveOrZero(message = "Marks obtained must be 0 or greater")
    @DecimalMin(value = "0", message = "Marks obtained must be at least 0")
    private int marksObtained;

    @Positive(message = "Total marks must be greater than 0")
    @Max(value = 1000, message = "Total marks cannot exceed 1000")
    private int totalMarks;

    @NotBlank(message = "Grade is required")
    @Pattern(regexp = "^[A-F]$", message = "Grade must be A, B, C, D, E, or F")
    private String grade;

    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;

    // Constructors
    public CreateGradeRequest() {}

    public CreateGradeRequest(String examId, Long studentId, int marksObtained, 
                             int totalMarks, String grade, String remarks) {
        this.examId = examId;
        this.studentId = studentId;
        this.marksObtained = marksObtained;
        this.totalMarks = totalMarks;
        this.grade = grade;
        this.remarks = remarks;
    }

    // Getters and Setters
    public String getExamId() {
        return examId;
    }

    public void setExamId(String examId) {
        this.examId = examId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public int getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(int marksObtained) {
        this.marksObtained = marksObtained;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

