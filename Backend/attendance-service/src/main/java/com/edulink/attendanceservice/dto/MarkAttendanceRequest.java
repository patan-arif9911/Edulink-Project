package com.edulink.attendanceservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * Request payload for marking a single student's attendance.
 * Status must be one of: PRESENT, ABSENT, OD, LATE, EXCUSED.
 */
public class MarkAttendanceRequest {

    @NotBlank(message = "rollNumber is required")
    private String rollNumber;

    @NotNull(message = "courseId is required")
    private Long courseId;

    @NotBlank(message = "schoolId is required")
    private String schoolId;

    @NotNull(message = "attendanceDate is required")
    private LocalDate attendanceDate;

    @NotBlank(message = "status is required")
    private String status;

    public MarkAttendanceRequest() {}

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
}
