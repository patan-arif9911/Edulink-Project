package com.edulink.examservice.dto;

import jakarta.validation.constraints.*;

/**
 * Request DTO for grading a student.
 * Teacher provides rollNumber, courseCode, examType and marks.
 * Grade letter is auto-calculated by the service.
 */
public class CreateGradeRequest {

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Exam type is required")
    private String examType;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    private String studentEmail;

    @PositiveOrZero(message = "Marks obtained must be 0 or greater")
    private int marksObtained;

    @Positive(message = "Total marks must be greater than 0")
    @Max(value = 1000, message = "Total marks cannot exceed 1000")
    private int totalMarks;

    private int passingMarks;

    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;

    public CreateGradeRequest() {}

    // Getters and Setters
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public int getMarksObtained() { return marksObtained; }
    public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public int getPassingMarks() { return passingMarks; }
    public void setPassingMarks(int passingMarks) { this.passingMarks = passingMarks; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

