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
        throw new UnsupportedOperationException("Assignment submission logic removed. Implement via identity-service or appropriate service.");
    }

    public AssignmentSubmission submitAssignmentByEmail(String email, SubmitAssignmentRequest request) {
        throw new UnsupportedOperationException("Assignment submission logic removed. Implement via identity-service or appropriate service.");
    }

    private final EnrollmentRepository enrollmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;
    private final GridFsService gridFsService;
    private final CourseServiceClient courseServiceClient;


    public List<Enrollment> getEnrolledCoursesByEmail(String email) {
        return enrollmentRepo.findByStudentEmail(email);
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
