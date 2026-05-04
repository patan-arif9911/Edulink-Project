package com.edulink.courseservice.controller;

import com.edulink.courseservice.dto.ApiResponse;
import com.edulink.courseservice.entity.Assignment;
import com.edulink.courseservice.entity.Course;
import com.edulink.courseservice.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/course/internal")
public class InternalController {
    private final CourseService courseService;

    public InternalController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/course/by-code/{courseCode}")
    public ResponseEntity<?> getCourseByCourseCode(@PathVariable String courseCode) {
        try {
            Course course = courseService.getCourseByCode(courseCode);
            if (course != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", course.getId());
                response.put("courseCode", course.getCourseCode());
                response.put("courseName", course.getCourseName());
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Course not found: " + courseCode));
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            List<Map<String, Object>> response = courses.stream()
                    .map(course -> {
                        Map<String, Object> courseMap = new HashMap<>();
                        courseMap.put("id", course.getId());
                        courseMap.put("courseCode", course.getCourseCode());
                        courseMap.put("courseName", course.getCourseName());
                        courseMap.put("schoolId", course.getSchoolId());
                        return courseMap;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Courses retrieved", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to retrieve courses: " + e.getMessage()));
        }
    }

    @GetMapping("/assignment/validate/{assignmentNum}/{courseCode}")
    public ResponseEntity<?> validateAssignment(@PathVariable Integer assignmentNum, @PathVariable String courseCode) {
        try {
            Course course = courseService.getCourseByCode(courseCode);
            if (course == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("exists", false);
                response.put("reason", "Course not found");
                return ResponseEntity.ok(response);
            }

            Assignment assignment = courseService.getAssignmentByCourseAndNumber(courseCode, assignmentNum);
            boolean exists = assignment != null;
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            if (exists) {
                response.put("assignmentTitle", assignment.getTitle());
                response.put("courseCode", assignment.getCourseCode());
            } else {
                response.put("reason", "Assignment not found for this course");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("exists", false);
            response.put("reason", "Error validating assignment: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}