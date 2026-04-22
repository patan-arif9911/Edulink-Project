package com.edulink.examservice.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "roll_number", nullable = false)
    private String rollNumber;

    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @Column(name = "marks_obtained", nullable = false)
    private int marksObtained;

    @Column(name = "total_marks", nullable = false)
    private int totalMarks;

    @Column(name = "passing_marks")
    private int passingMarks;

    @Column(name = "grade", nullable = false)
    private String grade;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    public Grade() {}

    public Grade(Long id, String courseCode, String examType, String rollNumber, String studentEmail,
                 String teacherEmail, int marksObtained, int totalMarks, int passingMarks,
                 String grade, String remarks, LocalDateTime gradedAt) {
        this.id = id;
        this.courseCode = courseCode;
        this.examType = examType;
        this.rollNumber = rollNumber;
        this.studentEmail = studentEmail;
        this.teacherEmail = teacherEmail;
        this.marksObtained = marksObtained;
        this.totalMarks = totalMarks;
        this.passingMarks = passingMarks;
        this.grade = grade;
        this.remarks = remarks;
        this.gradedAt = gradedAt;
    }

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

    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }

    public int getMarksObtained() { return marksObtained; }
    public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public int getPassingMarks() { return passingMarks; }
    public void setPassingMarks(int passingMarks) { this.passingMarks = passingMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }

    @PrePersist
    protected void onCreate() { gradedAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String courseCode;
        private String examType;
        private String rollNumber;
        private String studentEmail;
        private String teacherEmail;
        private int marksObtained;
        private int totalMarks;
        private int passingMarks;
        private String grade;
        private String remarks;
        private LocalDateTime gradedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder examType(String examType) { this.examType = examType; return this; }
        public Builder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder teacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; return this; }
        public Builder marksObtained(int marksObtained) { this.marksObtained = marksObtained; return this; }
        public Builder totalMarks(int totalMarks) { this.totalMarks = totalMarks; return this; }
        public Builder passingMarks(int passingMarks) { this.passingMarks = passingMarks; return this; }
        public Builder grade(String grade) { this.grade = grade; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder gradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; return this; }

        public Grade build() {
            return new Grade(id, courseCode, examType, rollNumber, studentEmail, teacherEmail,
                    marksObtained, totalMarks, passingMarks, grade, remarks, gradedAt);
        }
    }
}
