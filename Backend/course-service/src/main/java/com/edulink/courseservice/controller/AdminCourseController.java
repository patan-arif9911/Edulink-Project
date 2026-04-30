package com.edulink.courseservice.controller;
import com.edulink.courseservice.dto.ApiResponse;
import com.edulink.courseservice.entity.*;
import com.edulink.courseservice.service.CourseService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/course/admin")
@PreAuthorize("hasRole('SCHOOL_ADMIN')")
public class AdminCourseController {
    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/create-course")
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created", courseService.createCourse(course)));
    }

    @PostMapping("/create-class")
    public ResponseEntity<ApiResponse<ClassRoom>> createClass(@RequestBody ClassRoom c) {
        // Auto-derive schoolId from JWT token
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        if (details instanceof String schoolId) {
            c.setSchoolId(schoolId);
        }

        // Auto-generate classId as grade + section (e.g., grade=10, section=A → "10A")
        String classId = c.getGrade() + c.getSection();

        // Auto-generate className as "Class " + classId (e.g., "Class 10A")
        c.setClassName("Class " + classId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Class created", courseService.createClass(c)));
    }

    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<ClassRoom>>> getClasses() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        if (details instanceof String schoolId) {
            return ResponseEntity.ok(ApiResponse.success("Classes retrieved", courseService.getClassesBySchool(schoolId)));
        }
        return ResponseEntity.ok(ApiResponse.success("Classes retrieved", List.of()));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<Course>>> getCourses() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        if (details instanceof String schoolId) {
            return ResponseEntity.ok(ApiResponse.success("Courses retrieved", courseService.getCoursesBySchool(schoolId)));
        }
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved", List.of()));
    }

    @GetMapping("/attendance-report")
    public ResponseEntity<ApiResponse<Object>> attendanceReport() {
        return ResponseEntity.ok(ApiResponse.success("Attendance report (see attendance-service)", null));
    }
}
