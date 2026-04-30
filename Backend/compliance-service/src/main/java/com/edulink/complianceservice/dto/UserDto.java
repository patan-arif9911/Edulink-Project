package com.edulink.complianceservice.dto;

import com.edulink.complianceservice.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDto {
    @NotBlank(message = "email not fill")
    @Email
    private String email;
    @NotBlank(message = "fullName not fill")
    private String fullName;

    private String role;

    @NotBlank(message = "schoolId not fill")
    private String schoolId;

    private Long classId;

    public UserDto(){

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }
}
