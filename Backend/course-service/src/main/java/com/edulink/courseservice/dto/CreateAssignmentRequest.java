package com.edulink.courseservice.dto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateAssignmentRequest {
    private String courseCode;
    private String title;
    private String description;
    @NotNull(message = "Assignment due date is required")
    @FutureOrPresent(message = "Assignment due date cannot be in the past")
    private LocalDateTime dueDate;
    private int maxMarks;
    private MultipartFile questionsFile;

    // Getters and setters
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public int getMaxMarks() { return maxMarks; }
    public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }

    public MultipartFile getQuestionsFile() { return questionsFile; }
    public void setQuestionsFile(MultipartFile questionsFile) { this.questionsFile = questionsFile; }
}