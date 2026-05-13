package com.edulink.attendanceservice.controller;
import com.edulink.attendanceservice.dto.ApiResponse;
import com.edulink.attendanceservice.entity.Attendance;
import com.edulink.attendanceservice.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Mark attendance for a single student.
     * POST /teacher/mark-attendance
     */
    @PostMapping("/teacher/mark-attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Attendance>> markAttendance(@Valid @RequestBody Attendance attendance) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        attendance.setMarkedBy(teacherEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Attendance marked", attendanceService.markAttendance(attendance)));
    }

    /**
     * Bulk mark attendance for all students in a class.
     * POST /teacher/mark-attendance/bulk
     * Body: array of Attendance objects
     */
    @PostMapping("/teacher/mark-attendance/bulk")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> markAttendanceBulk(
            @RequestBody List<Attendance> records) {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        records.forEach(a -> a.setMarkedBy(teacherEmail));
        List<Attendance> saved = attendanceService.markAttendanceBulk(records);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Bulk attendance marked for " + saved.size() + " students", saved));
    }

    /**
     * Get attendance records for a student.
     * GET /student/attendance
     */
    @GetMapping("/student/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getStudentAttendance(
            @RequestParam(required = false) String rollNumber) {
        if (rollNumber == null || rollNumber.isBlank()) {
            Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
            if (details instanceof String && !((String) details).contains("@")) {
                rollNumber = (String) details;
            } else {
                return ResponseEntity.ok(ApiResponse.success("Attendance retrieved",
                        attendanceService.getAttendanceByEmail(
                                SecurityContextHolder.getContext().getAuthentication().getName())));
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved",
                attendanceService.getAttendanceByRollNumber(rollNumber)));
    }

    /**
     * Get attendance report for admin/teacher by schoolId.
     * GET /admin/attendance-report?schoolId=SCH001
     */
    @GetMapping("/admin/attendance-report")
    @PreAuthorize("hasRole('SCHOOL_ADMIN') or hasRole('TEACHER') or hasRole('EDUCATION_BOARD_OFFICER')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceReport(@RequestParam String schoolId) {
        return ResponseEntity.ok(ApiResponse.success("Attendance report",
                attendanceService.getAttendanceReport(schoolId)));
    }

    /**
     * Get attendance statistics for a course (for progress monitoring).
     * GET /teacher/attendance-progress?courseId=5
     */
    @GetMapping("/teacher/attendance-progress")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAttendanceProgress(
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Attendance progress",
                attendanceService.getProgressByCourse(courseId)));
    }

    /**
     * Get students with low attendance in a course (< 50%).
     * GET /teacher/low-attendance?courseId=5
     */
    @GetMapping("/teacher/low-attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLowAttendance(
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Low attendance students",
                attendanceService.getLowAttendanceStudents(courseId)));
    }
}
