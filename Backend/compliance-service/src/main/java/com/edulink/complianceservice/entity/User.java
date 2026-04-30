//package com.edulink.complianceservice.entity;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "users")
//public class User {
//    @Id
//    private String email;
//
//    private String password;
//
//    private String fullName;
//
//    @Enumerated(EnumType.STRING)
//    private Role role;
//
//
//    private boolean active = true;
//
//    private boolean mustChangePassword = false;
//
//    private String temporaryPassword;
//
//    @NotBlank(message = "password is not filled")
//    private String schoolId;
//
//    @NotBlank(message = "password is not filled")
//    private Long classId;
//
//    @DateTimeFormat
//    private LocalDateTime createdAt;
//
//    @NotBlank(message = "password is not filled")
//    private LocalDateTime updatedAt;
//
//    public User(){
//
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getFullName() {
//        return fullName;
//    }
//
//    public void setFullName(String fullName) {
//        this.fullName = fullName;
//    }
//
//    public Role getRole() {
//        return role;
//    }
//
//    public void setRole(Role role) {
//        this.role = role;
//    }
//
//    public boolean isActive() {
//        return active;
//    }
//
//    public void setActive(boolean active) {
//        this.active = active;
//    }
//
//    public boolean isMustChangePassword() {
//        return mustChangePassword;
//    }
//
//    public void setMustChangePassword(boolean mustChangePassword) {
//        this.mustChangePassword = mustChangePassword;
//    }
//
//    public String getTemporaryPassword() {
//        return temporaryPassword;
//    }
//
//    public void setTemporaryPassword(String temporaryPassword) {
//        this.temporaryPassword = temporaryPassword;
//    }
//
//    public String getSchoolId() {
//        return schoolId;
//    }
//
//    public void setSchoolId(String schoolId) {
//        this.schoolId = schoolId;
//    }
//
//    public Long getClassId() {
//        return classId;
//    }
//
//    public void setClassId(Long classId) {
//        this.classId = classId;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//}
