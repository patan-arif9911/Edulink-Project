package com.edulink.attendanceservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

/**
 * Request payload for marking attendance for an entire class on a given date.
 * Each entry holds one student's status; the service upserts on (rollNumber, courseId, date).
 */
public class BulkMarkAttendanceRequest {

    @NotNull(message = "courseId is required")
    private Long courseId;

    @NotBlank(message = "schoolId is required")
    private String schoolId;

    @NotNull(message = "attendanceDate is required")
    private LocalDate attendanceDate;

    @NotEmpty(message = "entries cannot be empty")
    @Valid
    private List<Entry> entries;

    public BulkMarkAttendanceRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getSchoolId() { return schoolId; }
    public void setSchoolId(String schoolId) { this.schoolId = schoolId; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public List<Entry> getEntries() { return entries; }
    public void setEntries(List<Entry> entries) { this.entries = entries; }

    public static class Entry {

        @NotBlank(message = "rollNumber is required")
        private String rollNumber;

        @NotBlank(message = "status is required")
        private String status;

        public Entry() {}

        public Entry(String rollNumber, String status) {
            this.rollNumber = rollNumber;
            this.status = status;
        }

        public String getRollNumber() { return rollNumber; }
        public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
