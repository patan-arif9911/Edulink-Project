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
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class StudentService {

    // FeignClient for identity-service
    private final com.edulink.studentservice.client.IdentityServiceClient identityServiceClient;

    public AssignmentSubmission submitAssignmentByEmail(String email, Integer assignmentNum, String courseCode, String assignmentTitle, String submissionContent, MultipartFile file, String token) {
        // 1. Look up studentId + rollNumber from identity-service (if token available)
        Long studentId = 0L;
        String rollNumber = null;
        if (hasText(token)) {
            try {
                Map<String, Object> userMap = identityServiceClient.getUserByEmail(email, token);
                if (userMap != null) {
                    if (userMap.get("userId") != null) {
                        studentId = Long.valueOf(userMap.get("userId").toString());
                    }
                    if (userMap.get("rollNumber") != null) {
                        rollNumber = userMap.get("rollNumber").toString();
                    }
                }
            } catch (Exception e) {
                log.warn("Could not look up identity for {}: {}", email, e.getMessage());
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
                .studentEmail(email)
                .rollNumber(rollNumber)
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

    /** Used by the student's "My Grades" page to show their graded assignment submissions. */
    public List<AssignmentSubmission> getGradedAssignmentsByEmail(String email) {
        return submissionRepo.findByStudentEmail(email).stream()
                .filter(s -> s.getMarksObtained() != null)
                .toList();
    }

    /** Used by the teacher's Evaluate Assignment Submission page to load one row. */
    public AssignmentSubmission getSubmissionById(Long id) {
        return submissionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + id));
    }

    /**
     * Teacher grades an assignment submission. Stores numeric marks + feedback, flips the
     * status to GRADED, records who graded it and when. Re-grading is allowed (overwrite).
     */
    public AssignmentSubmission gradeAssignmentSubmission(Long id, Integer marksObtained,
                                                          Integer maxMarks, String remarks,
                                                          String teacherEmail) {
        AssignmentSubmission row = getSubmissionById(id);

        if (marksObtained == null || marksObtained < 0) {
            throw new IllegalArgumentException("marksObtained must be 0 or greater");
        }
        if (maxMarks == null || maxMarks <= 0) {
            throw new IllegalArgumentException("maxMarks must be greater than 0");
        }
        if (marksObtained > maxMarks) {
            throw new IllegalArgumentException("marksObtained cannot exceed maxMarks");
        }

        row.setMarksObtained(marksObtained);
        row.setMaxMarks(maxMarks);
        row.setRemarks(remarks == null ? null : remarks.trim());
        row.setEvaluatedBy(teacherEmail);
        row.setEvaluatedAt(java.time.LocalDateTime.now());
        row.setStatus("GRADED");
        return submissionRepo.save(row);
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

    public List<Map<String, Object>> getAvailableCourses(String email, String token) {
        try {
            // Get all courses from course-service
            com.edulink.studentservice.dto.ApiResponse<List<Map<String, Object>>> allCoursesResponse = 
                courseServiceClient.getAllCourses(token);
            
            if (allCoursesResponse == null || allCoursesResponse.getData() == null) {
                return List.of();
            }
            
            List<Map<String, Object>> allCourses = allCoursesResponse.getData();
            
            // Get enrolled courses for the student
            List<Enrollment> enrolledCourses = enrollmentRepo.findByStudentEmail(email);
            List<String> enrolledCourseIds = enrolledCourses.stream()
                    .map(e -> String.valueOf(e.getCourseId()))
                    .collect(Collectors.toList());
            
            // Filter out enrolled courses
            return allCourses.stream()
                    .filter(course -> !enrolledCourseIds.contains(String.valueOf(course.get("id"))))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to get available courses for {}: {}", email, e.getMessage());
            return List.of();
        }
    }


}
