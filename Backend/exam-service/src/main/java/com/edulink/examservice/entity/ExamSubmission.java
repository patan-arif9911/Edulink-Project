package com.edulink.examservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_submissions")
public class ExamSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_id", nullable = false)
    private String examId;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "submission_content")
    private String submissionContent;

    @Column(name = "submission_file_id")
    private String submissionFileId;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "is_late")
    private boolean isLate;

    public ExamSubmission() {}

    public ExamSubmission(String examId, String studentEmail, String submissionContent,
                         String submissionFileId, LocalDateTime submittedAt, boolean isLate) {
        this.examId = examId;
        this.studentEmail = studentEmail;
        this.submissionContent = submissionContent;
        this.submissionFileId = submissionFileId;
        this.submittedAt = submittedAt;
        this.isLate = isLate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getExamId() { return examId; }
    public void setExamId(String examId) { this.examId = examId; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getSubmissionContent() { return submissionContent; }
    public void setSubmissionContent(String submissionContent) { this.submissionContent = submissionContent; }

    public String getSubmissionFileId() { return submissionFileId; }
    public void setSubmissionFileId(String submissionFileId) { this.submissionFileId = submissionFileId; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public boolean isLate() { return isLate; }
    public void setLate(boolean late) { isLate = late; }

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String examId;
        private String studentEmail;
        private String submissionContent;
        private String submissionFileId;
        private LocalDateTime submittedAt;
        private boolean isLate;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder examId(String examId) { this.examId = examId; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder submissionContent(String submissionContent) { this.submissionContent = submissionContent; return this; }
        public Builder submissionFileId(String submissionFileId) { this.submissionFileId = submissionFileId; return this; }
        public Builder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public Builder isLate(boolean isLate) { this.isLate = isLate; return this; }

        public ExamSubmission build() {
            return new ExamSubmission(examId, studentEmail, submissionContent, submissionFileId, submittedAt, isLate);
        }
    }
}