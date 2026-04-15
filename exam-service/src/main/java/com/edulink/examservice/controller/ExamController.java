package com.edulink.examservice.controller;

import com.edulink.examservice.dto.ApiResponse;
import com.edulink.examservice.dto.CreateExamRequest;
import com.edulink.examservice.dto.CreateGradeRequest;
import com.edulink.examservice.dto.SubmitExamRequest;
import com.edulink.examservice.entity.*;
import com.edulink.examservice.exception.AccessDeniedException;
import com.edulink.examservice.exception.InvalidExamException;
import com.edulink.examservice.exception.InvalidGradeException;
import com.edulink.examservice.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/exam")
public class ExamController {
    private final ExamService examService;
    private final GradeService gradeService;
    private final ExamSubmissionService examSubmissionService;

    public ExamController(ExamService examService, GradeService gradeService, ExamSubmissionService examSubmissionService) {
        this.examService = examService;
        this.gradeService = gradeService;
        this.examSubmissionService = examSubmissionService;
    }

    @PostMapping(value = "/teacher/create-exam", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Exam>> createExam(
            @RequestParam String courseCode,
            @RequestParam String examTitle,
            @RequestParam String examType,
            @RequestParam int totalMarks,
            @RequestParam int passingMarks,
            @RequestParam String schoolId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime examDate,
            @RequestParam(required = false) MultipartFile questionsFile) throws IOException {

        // Convert request to exam entity
        Exam exam = new Exam();
        exam.setCourseCode(courseCode);
        exam.setExamTitle(examTitle);
        exam.setExamType(examType);
        exam.setTotalMarks(totalMarks);
        exam.setPassingMarks(passingMarks);
        exam.setSchoolId(schoolId);
        exam.setExamDate(examDate);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam created", examService.createExam(exam, questionsFile)));
    }

    @PostMapping("/teacher/grade-student")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Grade>> gradeStudent(@Valid @RequestBody CreateGradeRequest request) {
        // Validate grade
        if (request.getGrade() == null || !isValidGrade(request.getGrade())) {
            throw new InvalidGradeException(request.getGrade(), "Invalid grade: " + request.getGrade());
        }
        
        // Convert request to grade entity
        Grade grade = new Grade();
        grade.setExamId(request.getExamId());
        grade.setStudentId(request.getStudentId());
        grade.setMarksObtained(request.getMarksObtained());
        grade.setTotalMarks(request.getTotalMarks());
        grade.setGrade(request.getGrade());
        grade.setRemarks(request.getRemarks());
        
        return ResponseEntity.ok(ApiResponse.success("Student graded", gradeService.gradeStudent(grade)));
    }

    @GetMapping("/student/grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Grade>>> getStudentGrades(@RequestParam(required = false) Long studentId) {
        if (studentId == null) {
            Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
            if (details instanceof Long) {
                studentId = (Long) details;
            } else if (details instanceof String) {
                studentId = Long.parseLong((String) details);
            } else {
                throw new RuntimeException("Invalid student identity in token");
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Grades retrieved", gradeService.getGradesByStudentId(studentId)));
    }

    @GetMapping("/student/exams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Exam>>> getAvailableExams(@RequestParam List<String> courseCodes) {
        List<Exam> exams = examService.getExamsByCourseCodes(courseCodes);
        return ResponseEntity.ok(ApiResponse.success("Available exams retrieved", exams));
    }

    @GetMapping("/student/download-exam-questions/{examId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<byte[]> downloadExamQuestions(@PathVariable String examId) throws IOException {
        byte[] fileContent = examService.downloadExamQuestions(examId);
        String fileName = examService.getExamQuestionsFileName(examId);
        String contentType = examService.getExamQuestionsContentType(examId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(fileContent);
    }

    @PostMapping("/student/submit-exam")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamSubmission>> submitExam(@RequestBody SubmitExamRequest request) {

        // Get student email from JWT token
        String studentEmail = (String) SecurityContextHolder.getContext()
                .getAuthentication().getDetails();

        ExamSubmission submission = examSubmissionService.submitExam(
            request.getExamId(),
            studentEmail,
            request.getSubmissionContent()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam submitted successfully", submission));
    }

    @GetMapping("/teacher/exam-submissions/{examId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ExamSubmission>>> getExamSubmissions(@PathVariable String examId) {
        List<ExamSubmission> submissions = examSubmissionService.getSubmissionsByExam(examId);
        return ResponseEntity.ok(ApiResponse.success("Exam submissions retrieved", submissions));
    }

    /**
     * Validate grade is A-F
     */
    private boolean isValidGrade(String grade) {
        return grade != null && grade.length() == 1 && "ABCDEF".contains(grade.toUpperCase());
    }
}
