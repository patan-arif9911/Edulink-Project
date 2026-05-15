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
            @RequestParam(required = false) Integer durationMinutes,
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
        exam.setDurationMinutes(durationMinutes);

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

    /**
     * Student clicks "Start Exam". Creates (or returns) the in-progress submission row
     * carrying startedAt. Frontend uses startedAt + exam.durationMinutes to compute the
     * countdown deadline. Refresh-safe: re-calling returns the same startedAt.
     */
    @PostMapping("/student/start-exam")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamSubmission>> startExam(@RequestBody SubmitExamRequest request) {
        String studentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        String rollNumber = (details instanceof String s && !s.contains("@")) ? s : null;

        ExamSubmission attempt = examSubmissionService.startExam(
                request.getCourseCode(), request.getExamType(), studentEmail, rollNumber);
        return ResponseEntity.ok(ApiResponse.success("Exam started", attempt));
    }

    /**
     * Final submission — text answer only. Students type their answer; no file uploads.
     */
    @PostMapping("/student/submit-exam")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamSubmission>> submitExam(@Valid @RequestBody SubmitExamRequest request) {
        String studentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();
        String rollNumber = (details instanceof String s && !s.contains("@")) ? s : null;

        ExamSubmission submission = examSubmissionService.submitExam(
                request.getCourseCode(), request.getExamType(),
                studentEmail, rollNumber, request.getSubmissionContent());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam submitted successfully", submission));
    }

    @GetMapping("/teacher/exam-submissions/{courseCode}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<ExamSubmission>>> getExamSubmissions(@PathVariable String courseCode) {
        List<ExamSubmission> submissions = examSubmissionService.getSubmissionsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Exam submissions retrieved", submissions));
    }

    /** Fetch a single submission with its content — backs the contextual evaluate page. */
    @GetMapping("/teacher/submission/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ExamSubmission>> getSubmissionById(@PathVariable Long id) {
        ExamSubmission submission = examSubmissionService.getSubmissionById(id)
                .orElseThrow(() -> new com.edulink.examservice.exception.ResourceNotFoundException(
                        "Submission not found: " + id));
        return ResponseEntity.ok(ApiResponse.success("Submission retrieved", submission));
    }

    /** Used by the per-exam roster table to mark students that already have a grade. */
    @GetMapping("/teacher/grades")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Grade>>> getGradesByExam(
            @RequestParam String courseCode,
            @RequestParam String examType) {
        List<Grade> grades = gradeService.getGradesByCourseCodeAndExamType(courseCode, examType);
        return ResponseEntity.ok(ApiResponse.success("Grades retrieved", grades));
    }

    /** All grades for a course across every examType — backs the View Grades page. */
    @GetMapping("/teacher/grades-by-course/{courseCode}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Grade>>> getGradesByCourse(@PathVariable String courseCode) {
        return ResponseEntity.ok(ApiResponse.success("Grades retrieved",
                gradeService.getGradesByCourseCode(courseCode)));
    }

    /**
     * Teacher-only "Reset Attempt": wipes a student's submission for an exam so they can retake.
     * Idempotent — returns the number of rows deleted (0 if nothing was there).
     */
    @DeleteMapping("/teacher/reset-attempt")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Long>> resetAttempt(
            @RequestParam String courseCode,
            @RequestParam String examType,
            @RequestParam String rollNumber) {
        long deleted = examSubmissionService.resetAttempt(courseCode, examType, rollNumber);
        return ResponseEntity.ok(ApiResponse.success(
                deleted == 0 ? "Nothing to reset" : "Reset complete — " + deleted + " row(s) removed",
                deleted));
    }

    @GetMapping("/teacher/exams/{courseCode}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Exam>>> getExamsByCourseCode(@PathVariable String courseCode) {
        List<Exam> exams = examService.getExamsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Exams retrieved", exams));
    }

    /** Returns every exam the authenticated teacher has created (across all courses). */
    @GetMapping("/teacher/exams")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<List<Exam>>> getMyExams() {
        String teacherEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Exam> exams = examService.getExamsByTeacherEmail(teacherEmail);
        return ResponseEntity.ok(ApiResponse.success("Exams retrieved", exams));
    }

}
