package com.edulink.examservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_submissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"course_code", "exam_type", "student_email"})
})
public class ExamSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "submission_content", columnDefinition = "TEXT")
    private String submissionContent;

    @Column(name = "submission_file_id")
    private String submissionFileId;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "is_late")
    private boolean isLate;

    /** When the student opened the exam (clicked "Start Exam"). Drives the countdown timer. */
    @Column(name = "started_at")
    private LocalDateTime startedAt;

    public ExamSubmission() {}

    public ExamSubmission(String courseCode, String examType, String rollNumber,
                          String studentEmail, String submissionContent,
                          String submissionFileId, LocalDateTime submittedAt, boolean isLate,
                          LocalDateTime startedAt) {
        this.courseCode = courseCode;
        this.examType = examType;
        this.rollNumber = rollNumber;
        this.studentEmail = studentEmail;
        this.submissionContent = submissionContent;
        this.submissionFileId = submissionFileId;
        this.submittedAt = submittedAt;
        this.isLate = isLate;
        this.startedAt = startedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

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

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }


    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String courseCode;
        private String examType;
        private String rollNumber;
        private String studentEmail;
        private String submissionContent;
        private String submissionFileId;
        private LocalDateTime submittedAt;
        private boolean isLate;
        private LocalDateTime startedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder examType(String examType) { this.examType = examType; return this; }
        public Builder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder submissionContent(String submissionContent) { this.submissionContent = submissionContent; return this; }
        public Builder submissionFileId(String submissionFileId) { this.submissionFileId = submissionFileId; return this; }
        public Builder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public Builder isLate(boolean isLate) { this.isLate = isLate; return this; }
        public Builder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }

        public ExamSubmission build() {
            return new ExamSubmission(courseCode, examType, rollNumber, studentEmail,
                    submissionContent, submissionFileId, submittedAt, isLate, startedAt);
        }
    }
}