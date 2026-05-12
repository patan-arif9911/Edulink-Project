package com.edulink.examservice.service;

import com.edulink.examservice.entity.Exam;
import com.edulink.examservice.entity.ExamSubmission;
import com.edulink.examservice.exception.InvalidExamException;
import com.edulink.examservice.repository.ExamRepository;
import com.edulink.examservice.repository.ExamSubmissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExamSubmissionService {
    private static final Logger log = LoggerFactory.getLogger(ExamSubmissionService.class);

    private final ExamSubmissionRepository examSubmissionRepository;
    private final ExamRepository examRepository;

    public ExamSubmissionService(ExamSubmissionRepository examSubmissionRepository,
                                ExamRepository examRepository) {
        this.examSubmissionRepository = examSubmissionRepository;
        this.examRepository = examRepository;
    }

    @Transactional
    public ExamSubmission submitExam(String courseCode, String examType, String studentEmail, String rollNumber, String submissionContent) {
        if (examType == null || examType.isBlank()) {
            throw new IllegalArgumentException("examType is required");
        }
        // Find the specific exam by (courseCode, examType). If a course has multiple exams of the
        // same type (e.g. a retake), we attach to the most recently created one.
        List<Exam> exams = examRepository.findByCourseCodeAndExamType(courseCode, examType);
        if (exams.isEmpty()) {
            throw new InvalidExamException(
                "No " + examType + " exam found for course: " + courseCode);
        }
        Exam exam = exams.get(exams.size() - 1);

        // Check if student already submitted for this specific exam
        if (examSubmissionRepository.existsByCourseCodeAndStudentEmailAndExamType(courseCode, studentEmail, exam.getExamType())) {
            throw new IllegalArgumentException("Student has already submitted for this exam");
        }

        if (submissionContent == null || submissionContent.trim().isEmpty()) {
            throw new IllegalArgumentException("Submission content cannot be empty");
        }

        boolean isLate = LocalDateTime.now().isAfter(exam.getExamDate());

        ExamSubmission submission = ExamSubmission.builder()
                .courseCode(courseCode)
                .examType(exam.getExamType())
                .rollNumber(rollNumber)
                .studentEmail(studentEmail)
                .submissionContent(submissionContent.trim())
                .isLate(isLate)
                .build();

        return examSubmissionRepository.save(submission);
    }

    public List<ExamSubmission> getSubmissionsByCourseCode(String courseCode) {
        return examSubmissionRepository.findByCourseCode(courseCode);
    }

    public List<ExamSubmission> getSubmissionsByStudent(String studentEmail) {
        return examSubmissionRepository.findByStudentEmail(studentEmail);
    }

    public Optional<ExamSubmission> getSubmissionById(Long submissionId) {
        return examSubmissionRepository.findById(submissionId);
    }

    public Optional<ExamSubmission> getSubmissionByExamAndStudent(String courseCode, String studentEmail) {
        return examSubmissionRepository.findByCourseCodeAndStudentEmail(courseCode, studentEmail);
    }
}