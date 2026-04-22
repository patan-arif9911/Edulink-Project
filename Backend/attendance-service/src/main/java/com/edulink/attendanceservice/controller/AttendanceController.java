package com.edulink.attendanceservice.controller;
import com.edulink.attendanceservice.dto.ApiResponse;
import com.edulink.attendanceservice.entity.Attendance;
import com.edulink.attendanceservice.service.AttendanceService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/teacher/mark-attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Attendance>> markAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Attendance marked", attendanceService.markAttendance(attendance)));
    }

    @GetMapping("/student/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getStudentAttendance(
            @RequestParam(required = false) String rollNumber) {
        if (rollNumber == null || rollNumber.isBlank()) {
            // Extract rollNumber stored in token details by JwtAuthFilter
            Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
            if (details instanceof String && !((String) details).contains("@")) {
                rollNumber = (String) details; // it's a rollNumber like SCH001101
            } else {
                // Fallback: no rollNumber in token (old token), return empty
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
        return ResponseEntity.ok(ApiResponse.success("Attendance report", attendanceService.getAttendanceReport(schoolId)));
    }
}
