package com.edulink.examservice.controller;

import com.edulink.examservice.dto.ApiResponse;
import com.edulink.examservice.dto.CreateExamRequest;
import com.edulink.examservice.dto.CreateGradeRequest;
import com.edulink.examservice.dto.SubmitExamRequest;
import com.edulink.examservice.entity.*;
import com.edulink.examservice.exception.AccessDeniedException;
import com.edulink.examservice.exception.InvalidExamException;
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
        Grade grade = new Grade();
        grade.setCourseCode(request.getCourseCode());
        grade.setExamType(request.getExamType());
        grade.setRollNumber(request.getRollNumber());
        grade.setStudentEmail(request.getStudentEmail());
        grade.setMarksObtained(request.getMarksObtained());
        grade.setTotalMarks(request.getTotalMarks());
        grade.setPassingMarks(request.getPassingMarks());
        grade.setRemarks(request.getRemarks());

        return ResponseEntity.ok(ApiResponse.success("Student graded", gradeService.gradeStudent(grade)));
    }

    @GetMapping("/student/grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Grade>>> getStudentGrades() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        String rollNumber = (details instanceof String d && !d.contains("@")) ? d : null;
        if (rollNumber == null) {
            throw new RuntimeException("Roll number not found in token");
        }
        return ResponseEntity.ok(ApiResponse.success("Grades retrieved", gradeService.getGradesByRollNumber(rollNumber)));
    }

    @GetMapping("/student/exams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Exam>>> getAvailableExams(@RequestParam List<String> courseCodes) {
        List<Exam> exams = examService.getExamsByCourseCodes(courseCodes);
        return ResponseEntity.ok(ApiResponse.success("Available exams retrieved", exams));
    }

    @GetMapping("/student/download-exam-questions/{examId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<byte[]> downloadExamQuestions(@PathVariable Long examId) throws IOException {
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

        // Get studentEmail and rollNumber from JWT token
        // JwtAuthFilter now directly stores rollNumber in details for STUDENT role
        String studentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        String rollNumber = (details instanceof String detailStr && !detailStr.contains("@"))
                ? detailStr : null;

        ExamSubmission submission = examSubmissionService.submitExam(
            request.getCourseCode(),  // courseCode instead of numeric examId
            studentEmail,
            rollNumber,
            request.getSubmissionContent()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam submitted successfully", submission));
    }

    @GetMapping("/teacher/exam-submissions/{courseCode}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ExamSubmission>>> getExamSubmissions(@PathVariable String courseCode) {
        List<ExamSubmission> submissions = examSubmissionService.getSubmissionsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Exam submissions retrieved", submissions));
    }

}
