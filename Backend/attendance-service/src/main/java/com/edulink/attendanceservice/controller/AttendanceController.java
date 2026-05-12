package com.edulink.attendanceservice.controller;

import com.edulink.attendanceservice.dto.ApiResponse;
import com.edulink.attendanceservice.dto.BulkMarkAttendanceRequest;
import com.edulink.attendanceservice.dto.MarkAttendanceRequest;
import com.edulink.attendanceservice.entity.Attendance;
import com.edulink.attendanceservice.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /** Mark or update a single student's attendance. Kept for backwards compatibility. */
    @PostMapping("/teacher/mark-attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Attendance>> markAttendance(
            @Valid @RequestBody MarkAttendanceRequest request) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Attendance saved = attendanceService.markAttendance(request, teacherEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance marked", saved));
    }

    /** Mark attendance for an entire class on one date in a single request. */
    @PostMapping("/teacher/mark-attendance/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> markAttendanceBulk(
            @Valid @RequestBody BulkMarkAttendanceRequest request) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Attendance> saved = attendanceService.markAttendanceBulk(request, teacherEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance saved for " + saved.size() + " students", saved));
    }

    /** Pre-fill the teacher's marking table when revisiting a class+date combination. */
    @GetMapping("/teacher/attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceForClassDate(
            @RequestParam Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> records = attendanceService.getAttendanceByClassAndDate(courseId, date);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved", records));
    }

    @GetMapping("/student/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getStudentAttendance(
            @RequestParam(required = false) String rollNumber) {
        if (rollNumber == null || rollNumber.isBlank()) {
            // Extract rollNumber stored in token details by JwtAuthFilter
            Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
            if (details instanceof String && !((String) details).contains("@")) {
                rollNumber = (String) details;
            } else {
                // Fallback for legacy tokens that don't carry rollNumber: filter by markedBy email
                return ResponseEntity.ok(ApiResponse.success("Attendance retrieved",
                        attendanceService.getAttendanceByEmail(
                                SecurityContextHolder.getContext().getAuthentication().getName())));
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved",
                attendanceService.getAttendanceByRollNumber(rollNumber)));
    }

    @GetMapping("/admin/attendance-report")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('TEACHER') or hasRole('EDUCATION_BOARD_OFFICER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceReport(@RequestParam String schoolId) {
        return ResponseEntity.ok(ApiResponse.success("Attendance report",
                attendanceService.getAttendanceReport(schoolId)));
    }
}
