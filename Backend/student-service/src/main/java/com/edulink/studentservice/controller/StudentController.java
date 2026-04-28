package com.edulink.studentservice.controller;

import com.edulink.studentservice.client.CourseServiceClient;
import com.edulink.studentservice.client.ExamServiceClient;
import com.edulink.studentservice.client.AttendanceServiceClient;
import com.edulink.studentservice.dto.*;
import com.edulink.studentservice.entity.*;
import com.edulink.studentservice.service.GridFsService;
import com.edulink.studentservice.service.StudentService;
import com.edulink.studentservice.util.JwtExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@Slf4j
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final JwtExtractor jwtExtractor;
    private final CourseServiceClient courseServiceClient;
    private final ExamServiceClient examServiceClient;
    private final AttendanceServiceClient attendanceServiceClient;
    private final GridFsService gridFsService;


    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getCourses(HttpServletRequest req) {
        String email = jwtExtractor.extractEmail(req);
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved", studentService.getEnrolledCoursesByEmail(email)));
    }

    @PostMapping("/enroll")
    public ResponseEntity<ApiResponse<Enrollment>> enrollInCourse(HttpServletRequest req, @RequestBody Map<String, String> request) {
        String email = jwtExtractor.extractEmail(req);
        String courseCode = request.get("courseCode");
        if (courseCode == null || courseCode.isBlank()) {
            throw new IllegalArgumentException("courseCode is required");
        }
        String token = jwtExtractor.extractToken(req);
        Enrollment enrollment = studentService.enrollInCourseByEmailAndCode(email, courseCode, courseServiceClient, "Bearer " + token);
        return ResponseEntity.ok(ApiResponse.success("Enrolled in course successfully", enrollment));
    }

    @GetMapping("/materials/{courseCode}")
    public ResponseEntity<ApiResponse<List<LearningMaterialDto>>> getMaterials(HttpServletRequest req, @PathVariable String courseCode) {
        String token = jwtExtractor.extractToken(req);
        ApiResponse<List<LearningMaterialDto>> response = courseServiceClient.getMaterialsByCourseCode(courseCode, "Bearer " + token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignments/{courseCode}")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignments(HttpServletRequest req, @PathVariable String courseCode) {
        String token = jwtExtractor.extractToken(req);
        ApiResponse<List<AssignmentDto>> response = courseServiceClient.getAssignmentsByCourseCode(courseCode, "Bearer " + token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assignments/upload")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submitAssignment(
            HttpServletRequest req, 
            @RequestParam Integer assignmentNum,
            @RequestParam String courseCode,
            @RequestParam String assignmentTitle,
            @RequestParam(required = false) String submissionContent,
            @RequestParam(required = false) MultipartFile file) {
        String email = jwtExtractor.extractEmail(req);
        String token = jwtExtractor.extractToken(req);
        AssignmentSubmission sub = studentService.submitAssignmentByEmail(
            email, assignmentNum, courseCode, assignmentTitle, submissionContent, file, "Bearer " + token);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", sub));
    }

    @PostMapping("/assignments/upload-legacy")
    public ResponseEntity<ApiResponse<AssignmentSubmission>> submitAssignmentLegacy(
            HttpServletRequest req, @Valid @RequestBody SubmitAssignmentRequest request) {
        String email = jwtExtractor.extractEmail(req);
        AssignmentSubmission sub = studentService.submitAssignmentByEmail(email, request);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", sub));
    }

    // The /grades, /attendance, and /profile endpoints using StudentProfile have been removed.

    // ── Teacher: View assignment submissions by course ──
    @GetMapping("/teacher-submissions/{courseCode}")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getSubmissionsByCourse(
            @PathVariable String courseCode, HttpServletRequest req) {
        log.info("Teacher {} fetching submissions for course {}", jwtExtractor.extractEmail(req), courseCode);
        List<AssignmentSubmission> submissions = studentService.getSubmissionsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Submissions fetched", submissions));
    }

    // ── Teacher: Download submitted assignment file ──
    @GetMapping("/teacher-submissions/download/{fileId}")
    public ResponseEntity<Resource> downloadSubmissionFile(
            @PathVariable String fileId, HttpServletRequest req) {
        log.info("Teacher {} downloading submission file {}", jwtExtractor.extractEmail(req), fileId);
        try {
            byte[] fileContent = gridFsService.downloadFile(fileId);
            String fileName = gridFsService.getFileName(fileId);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (Exception e) {
            log.error("Failed to download submission file {}: {}", fileId, e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/materials/download/{fileId}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable String fileId) {
        try {
            byte[] fileContent = gridFsService.downloadFile(fileId);
            String fileName = gridFsService.getFileName(fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
