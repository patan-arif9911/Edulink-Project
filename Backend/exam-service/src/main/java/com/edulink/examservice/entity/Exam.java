package com.edulink.examservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false)
    private String courseCode;
    private String teacherEmail;
    private String examTitle;
    private String examType;
    private int totalMarks;
    private int passingMarks;
    private String schoolId;
    private String questionsFileId; // GridFS file ID for questions document
    @NotNull(message = "Exam date is required")
    @Column(nullable = false)
    private LocalDateTime examDate;
    private LocalDateTime createdAt;

    /** How long the student has to complete the exam once started. Null = no time limit. */
    private Integer durationMinutes;

    public Exam() {
    }

    public Exam(Long id, String courseCode, String teacherEmail, String examTitle, String examType,
                int totalMarks, int passingMarks, String schoolId, String questionsFileId,
                LocalDateTime examDate, LocalDateTime createdAt, Integer durationMinutes) {
        this.id = id;
        this.courseCode = courseCode;
        this.teacherEmail = teacherEmail;
        this.examTitle = examTitle;
        this.examType = examType;
        this.totalMarks = totalMarks;
        this.passingMarks = passingMarks;
        this.schoolId = schoolId;
        this.questionsFileId = questionsFileId;
        this.examDate = examDate;
        this.createdAt = createdAt;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }
    public int getPassingMarks() { return passingMarks; }
    public void setPassingMarks(int passingMarks) { this.passingMarks = passingMarks; }
    public String getSchoolId() { return schoolId; }
    public void setSchoolId(String schoolId) { this.schoolId = schoolId; }
    public String getQuestionsFileId() { return questionsFileId; }
    public void setQuestionsFileId(String questionsFileId) { this.questionsFileId = questionsFileId; }
    public LocalDateTime getExamDate() { return examDate; }
    public void setExamDate(LocalDateTime examDate) { this.examDate = examDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String courseCode;
        private String teacherEmail;
        private String examTitle;
        private String examType;
        private int totalMarks;
        private int passingMarks;
        private String schoolId;
        private String questionsFileId;
        private LocalDateTime examDate;
        private LocalDateTime createdAt;
        private Integer durationMinutes;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder teacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; return this; }
        public Builder examTitle(String examTitle) { this.examTitle = examTitle; return this; }
        public Builder examType(String examType) { this.examType = examType; return this; }
        public Builder totalMarks(int totalMarks) { this.totalMarks = totalMarks; return this; }
        public Builder passingMarks(int passingMarks) { this.passingMarks = passingMarks; return this; }
        public Builder schoolId(String schoolId) { this.schoolId = schoolId; return this; }
        public Builder questionsFileId(String questionsFileId) { this.questionsFileId = questionsFileId; return this; }
        public Builder examDate(LocalDateTime examDate) { this.examDate = examDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }

        public Exam build() {
            return new Exam(id, courseCode, teacherEmail, examTitle, examType, totalMarks, passingMarks, schoolId, questionsFileId, examDate, createdAt, durationMinutes);
        }
    }
}
