package com.edulink.identityservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String fullName;

    private String password;
    private String schoolId;
    private Long classId;

    /**
     * Unique roll number in format: {schoolId}{classId}{2-digit-rollNum}
     * e.g. SCH001101 => school SCH001, class 1, roll 01
     */
    @Column(unique = true)
    private String rollNumber;

    private LocalDateTime createdAt;

    public Student() {}

    public Student(String userId, String email, String fullName, String schoolId, Long classId, String password) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.schoolId = schoolId;
        this.classId = classId;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }

    public Student(String userId, String email, String fullName, String schoolId, Long classId, String password, String rollNumber) {
        this(userId, email, fullName, schoolId, classId, password);
        this.rollNumber = rollNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getSchoolId() { return schoolId; }
    public void setSchoolId(String schoolId) { this.schoolId = schoolId; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
