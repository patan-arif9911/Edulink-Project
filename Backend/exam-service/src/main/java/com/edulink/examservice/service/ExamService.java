package com.edulink.examservice.service;

import com.edulink.examservice.entity.Exam;
import com.edulink.examservice.repository.ExamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import java.io.IOException;
import java.util.List;

@Service
public class ExamService {
    private static final Logger log = LoggerFactory.getLogger(ExamService.class);

    private final ExamRepository examRepository;
    private final GridFsService gridFsService;

    @Value("${course.service.url:http://localhost:8083}")
    private String courseServiceUrl;

    public ExamService(ExamRepository examRepository, GridFsService gridFsService) {
        this.examRepository = examRepository;
        this.gridFsService = gridFsService;
    }

    public Exam createExam(Exam exam, MultipartFile questionsFile) throws IOException {

        // 1️ Get teacher email from JWT token
        String teacherEmail = (String)
                SecurityContextHolder.getContext()
                        .getAuthentication().getDetails();
        exam.setTeacherEmail(teacherEmail);

        // Passing marks must not be greater than total marks
        if (exam.getPassingMarks() > exam.getTotalMarks()) {
            throw new IllegalArgumentException(
                    "Passing marks cannot be greater than total marks");
        }

        //  Exam date should be future date
        if (exam.getExamDate().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Exam date must be in the future");
        }

        // Handle questions file upload
        if (questionsFile != null && !questionsFile.isEmpty()) {
            String fileId = gridFsService.uploadFile(questionsFile, exam.getCourseCode());
            exam.setQuestionsFileId(fileId);
        }

        // 5️⃣ Save exam into database
        return examRepository.save(exam);
    }

    public List<Exam> getExamsByCourseId(Long courseId) {
        // Since courseId is not stored, this method may need to be updated to take courseCode
        // For now, return empty list or implement logic to get courseCode from course-service
        return List.of();
    }

    public List<Exam> getExamsBySchoolId(String schoolId) {
        return examRepository.findBySchoolId(schoolId);
    }

    public List<Exam> getExamsByCourseCodes(List<String> courseCodes) {
        return examRepository.findByCourseCodeIn(courseCodes);
    }

    public List<Exam> getExamsByCourseCode(String courseCode) {
        return examRepository.findByCourseCode(courseCode);
    }

    /** Every exam this teacher has created across all their courses. */
    public List<Exam> getExamsByTeacherEmail(String teacherEmail) {
        return examRepository.findByTeacherEmail(teacherEmail);
    }

    public byte[] downloadExamQuestions(Long examId) throws IOException {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + examId));

        if (exam.getQuestionsFileId() == null) {
            throw new IllegalArgumentException("No questions file found for this exam");
        }

        return gridFsService.downloadFile(exam.getQuestionsFileId());
    }

    public String getExamQuestionsFileName(Long examId) {
        Exam exam = examRepository.findById(examId).orElse(null);
        if (exam == null || exam.getQuestionsFileId() == null) {
            return null;
        }
        return gridFsService.getFileName(exam.getQuestionsFileId());
    }

    public String getExamQuestionsContentType(Long examId) {
        Exam exam = examRepository.findById(examId).orElse(null);
        if (exam == null || exam.getQuestionsFileId() == null) {
            return "application/octet-stream";
        }
        return gridFsService.getContentType(exam.getQuestionsFileId());
    }
}