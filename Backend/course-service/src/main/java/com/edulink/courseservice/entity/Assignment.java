package com.edulink.courseservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity @Table(name = "assignments")
public class Assignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @jakarta.validation.constraints.NotNull
    @Column(nullable = false)
    private Integer assignmentNum;
    private String courseCode;
    private String teacherEmail;
    private String title;
    private String description;
    @NotNull(message = "Assignment due date is required")
    @FutureOrPresent(message = "Assignment due date cannot be in the past")
    @Column(nullable = false)
    private LocalDateTime dueDate;
    private int maxMarks;
    private LocalDateTime createdAt;
    private String questionsFileId;

    public Assignment() {
    }

    public Assignment(String courseCode, String teacherEmail, String title, String description,
                      Integer assignmentNum, LocalDateTime dueDate, int maxMarks, LocalDateTime createdAt, String questionsFileId) {
        this.assignmentNum = assignmentNum;
        this.courseCode = courseCode;
        this.teacherEmail = teacherEmail;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.maxMarks = maxMarks;
        this.createdAt = createdAt;
        this.questionsFileId = questionsFileId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getAssignmentNum() { return assignmentNum; }
    public void setAssignmentNum(Integer assignmentNum) { this.assignmentNum = assignmentNum; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public int getMaxMarks() { return maxMarks; }
    public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getQuestionsFileId() { return questionsFileId; }
    public void setQuestionsFileId(String questionsFileId) { this.questionsFileId = questionsFileId; }

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String courseCode;
        private Integer assignmentNum;
        private String teacherEmail;
        private String title;
        private String description;
        private LocalDateTime dueDate;
        private int maxMarks;
        private LocalDateTime createdAt;
        private String questionsFileId;

        public Builder assignmentNum(Integer assignmentNum) { this.assignmentNum = assignmentNum; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder teacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder dueDate(LocalDateTime dueDate) { this.dueDate = dueDate; return this; }
        public Builder maxMarks(int maxMarks) { this.maxMarks = maxMarks; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder questionsFileId(String questionsFileId) { this.questionsFileId = questionsFileId; return this; }
        public Assignment build() {
            return new Assignment(courseCode, teacherEmail, title, description, assignmentNum, dueDate, maxMarks, createdAt, questionsFileId);
        }
    }
}
