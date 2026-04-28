package com.edulink.studentservice.service;

import com.edulink.studentservice.client.CourseServiceClient;
import com.edulink.studentservice.dto.SubmitAssignmentRequest;
import com.edulink.studentservice.entity.*;
import com.edulink.studentservice.exception.CourseNotFoundException;
import com.edulink.studentservice.exception.StudentAlreadyEnrolledException;
import com.edulink.studentservice.exception.StudentNotEnrolledInCourseException;
import com.edulink.studentservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentService {

    // FeignClient for identity-service
    private final com.edulink.studentservice.client.IdentityServiceClient identityServiceClient;

    public AssignmentSubmission submitAssignmentByEmail(String email, Integer assignmentNum, String courseCode, String assignmentTitle, String submissionContent, MultipartFile file, String token) {
        // 1. Look up studentId from identity-service (if token available)
        Long studentId = 0L;
        if (hasText(token)) {
            try {
                Map<String, Object> userMap = identityServiceClient.getUserByEmail(email, token);
                if (userMap != null && userMap.get("userId") != null) {
                    studentId = Long.valueOf(userMap.get("userId").toString());
                }
            } catch (Exception e) {
                log.warn("Could not look up studentId for {}: {}", email, e.getMessage());
            }
        }

        // 2. Verify student is enrolled in the course
        if (!enrollmentRepo.existsByStudentEmailAndCourseCode(email, courseCode)) {
            throw new StudentNotEnrolledInCourseException(email, courseCode);
        }

        // 3. Upload file to GridFS if provided
        String fileId = null;
        String fileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                fileId = gridFsService.uploadFile(file, courseCode);
                fileName = file.getOriginalFilename();
            } catch (Exception e) {
                log.error("Failed to upload assignment file for {}: {}", email, e.getMessage());
                throw new RuntimeException("File upload failed: " + e.getMessage());
            }
        }

        // 4. Build and save submission
        AssignmentSubmission submission = AssignmentSubmission.builder()
                .studentId(studentId)
                .assignmentNum(assignmentNum)
                .courseCode(courseCode)
                .assignmentTitle(assignmentTitle)
                .submissionContent(submissionContent)
                .fileId(fileId)
                .fileName(fileName)
                .status("SUBMITTED")
                .submittedAt(java.time.LocalDateTime.now())
                .build();

        submissionRepo.save(submission);
        log.info("Assignment submitted by {} for course {} (assignment #{})", email, courseCode, assignmentNum);
        return submission;
    }

    public AssignmentSubmission submitAssignmentByEmail(String email, SubmitAssignmentRequest request) {
        return submitAssignmentByEmail(
                email,
                request.getAssignmentNum(),
                request.getCourseCode(),
                request.getAssignmentTitle(),
                request.getSubmissionContent(),
                null, null
        );
    }

    private final EnrollmentRepository enrollmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;
    private final GridFsService gridFsService;
    private final CourseServiceClient courseServiceClient;


    public List<Enrollment> getEnrolledCoursesByEmail(String email) {
        return enrollmentRepo.findByStudentEmail(email);
    }

    public List<AssignmentSubmission> getSubmissionsByCourseCode(String courseCode) {
        return submissionRepo.findByCourseCode(courseCode);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public void enrollInCourse(String userId, Long courseId) {
        throw new UnsupportedOperationException("Student profile logic removed. Implement enrollment via identity-service.");
    }


    public Enrollment enrollInCourseByEmailAndCode(String email, String courseCode, CourseServiceClient courseServiceClient, String token) {
        // 1. Verify student exists in identity-service
        Map<String, Object> userMap = identityServiceClient.getUserByEmail(email, token);
        if (userMap == null || userMap.get("email") == null) {
            throw new RuntimeException("Student not found in identity-service for email: " + email);
        }

        // 2. Get course info from course-service
        Map<String, Object> courseMap = courseServiceClient.getCourseByCourseCode(courseCode, token);
        if (courseMap == null || courseMap.get("id") == null) {
            throw new CourseNotFoundException("Course not present for code: " + courseCode);
        }
        Long courseId;
        try {
            courseId = Long.valueOf(courseMap.get("id").toString());
        } catch (Exception e) {
            throw new RuntimeException("Invalid course id from course-service");
        }
        String courseName = courseMap.getOrDefault("courseName", "").toString();

        // 3. Check if already enrolled
        if (enrollmentRepo.existsByStudentEmailAndCourseCode(email, courseCode)) {
            throw new StudentAlreadyEnrolledException(email, courseCode);
        }

        // 4. Create and save enrollment
        Enrollment enrollment = Enrollment.builder()
                .studentEmail(email)
                .courseId(courseId)
                .courseCode(courseCode)
                .courseName(courseName)
                .status("ACTIVE")
                .enrolledAt(java.time.LocalDateTime.now())
                .build();
        enrollmentRepo.save(enrollment);
        return enrollment;
    }

    public List<AssignmentSubmission> getSubmissions(String userId) {
        throw new UnsupportedOperationException("Student profile logic removed. Implement submission lookup via identity-service.");
    }


}
