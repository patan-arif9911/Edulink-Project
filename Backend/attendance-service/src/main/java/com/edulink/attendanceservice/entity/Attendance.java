package com.edulink.attendanceservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Roll number from identity-service students table e.g. SCH001101 */
    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[A-Z]{3}\\d{6}$",
            message = "Roll number must follow pattern: 3 uppercase letters followed by 6 digits (e.g., SCH001101)")
    @Size(max = 20, message = "Roll number must not exceed 20 characters")
    @Column(nullable = false)
    private String rollNumber;

    @NotNull(message = "Course ID is required")
    @Positive(message = "Course ID must be a positive number")
    @Column(nullable = false)
    private Long courseId;

    @NotBlank(message = "School ID is required")
    @Size(max = 20, message = "School ID must not exceed 20 characters")
    @Column(nullable = false)
    private String schoolId;

    @NotNull(message = "Attendance date is required")
    @PastOrPresent(message = "Attendance date cannot be in the future")
    @Column(nullable = false)
    private LocalDate attendanceDate;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PRESENT|ABSENT|LATE|EXCUSED)$",
            message = "Status must be one of: PRESENT, ABSENT, LATE, EXCUSED")
    @Column(nullable = false)
    private String status; // PRESENT, ABSENT, LATE, EXCUSED

    @NotBlank(message = "MarkedBy field is required")
    @Size(max = 50, message = "MarkedBy must not exceed 50 characters")
    @Column(nullable = false)
    private String markedBy;

    @PastOrPresent(message = "Created date cannot be in the future")
    private LocalDateTime createdAt;

    public Attendance() {
    }

    public Attendance(Long id, String rollNumber, Long courseId, String schoolId,
                      LocalDate attendanceDate, String status, String markedBy,
                      LocalDateTime createdAt) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.courseId = courseId;
        this.schoolId = schoolId;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.markedBy = markedBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getSchoolId() { return schoolId; }
    public void setSchoolId(String schoolId) { this.schoolId = schoolId; }
    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMarkedBy() { return markedBy; }
    public void setMarkedBy(String markedBy) { this.markedBy = markedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String rollNumber;
        private Long courseId;
        private String schoolId;
        private LocalDate attendanceDate;
        private String status;
        private String markedBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public Builder courseId(Long courseId) { this.courseId = courseId; return this; }
        public Builder schoolId(String schoolId) { this.schoolId = schoolId; return this; }
        public Builder attendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder markedBy(String markedBy) { this.markedBy = markedBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Attendance build() {
            return new Attendance(id, rollNumber, courseId, schoolId, attendanceDate, status, markedBy, createdAt);
        }
    }
}