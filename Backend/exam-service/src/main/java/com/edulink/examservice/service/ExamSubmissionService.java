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

    /**
     * Called when the student clicks "Start Exam". Creates (or returns the existing) in-progress
     * row carrying the startedAt timestamp the frontend uses to compute the countdown deadline.
     */
    @Transactional
    public ExamSubmission startExam(String courseCode, String examType,
                                    String studentEmail, String rollNumber) {
        Exam exam = resolveExam(courseCode, examType);
        try {
            Optional<ExamSubmission> existing = examSubmissionRepository
                    .findByCourseCodeAndExamTypeAndStudentEmail(courseCode, exam.getExamType(), studentEmail);
            if (existing.isPresent()) {
                ExamSubmission row = existing.get();
                if (row.getSubmittedAt() != null) {
                    throw new IllegalArgumentException("Student has already submitted for this exam");
                }
                // Resume: keep the original startedAt so refreshes don't reset the timer
                return row;
            }
            ExamSubmission row = ExamSubmission.builder()
                    .courseCode(courseCode)
                    .examType(exam.getExamType())
                    .rollNumber(rollNumber)
                    .studentEmail(studentEmail)
                    .startedAt(LocalDateTime.now())
                    .build();
            return examSubmissionRepository.save(row);
        } catch (Exception e) {
            log.warn("Error in startExam ({}): {}", e.getClass().getSimpleName(), e.getMessage());
            // Fallback: Use resilient query that handles duplicates by returning latest
            Optional<ExamSubmission> existing = examSubmissionRepository
                    .findLatestByCourseCodeAndExamTypeAndStudentEmail(courseCode, exam.getExamType(), studentEmail);
            if (existing.isPresent()) {
                ExamSubmission row = existing.get();
                if (row.getSubmittedAt() != null) {
                    throw new IllegalArgumentException("Student has already submitted for this exam");
                }
                return row;
            }
            // If no record at all, create a new one
            ExamSubmission row = ExamSubmission.builder()
                    .courseCode(courseCode)
                    .examType(exam.getExamType())
                    .rollNumber(rollNumber)
                    .studentEmail(studentEmail)
                    .startedAt(LocalDateTime.now())
                    .build();
            return examSubmissionRepository.save(row);
        }
    }

    /**
     * Finalises the submission with the student's typed text answer.
     * Looks up the in-progress row (created by startExam) and updates it; if no prior start
     * exists (e.g. legacy clients), a fresh row is created on the fly.
     */
    @Transactional
    public ExamSubmission submitExam(String courseCode, String examType,
                                     String studentEmail, String rollNumber,
                                     String submissionContent) {
        Exam exam = resolveExam(courseCode, examType);

        if (submissionContent == null || submissionContent.trim().isEmpty()) {
            throw new IllegalArgumentException("Submission content cannot be empty");
        }

        try {
            Optional<ExamSubmission> existing = examSubmissionRepository
                    .findByCourseCodeAndExamTypeAndStudentEmail(courseCode, exam.getExamType(), studentEmail);
            ExamSubmission row;
            if (existing.isPresent()) {
                row = existing.get();
                if (row.getSubmittedAt() != null) {
                    throw new IllegalArgumentException("Student has already submitted for this exam");
                }
            } else {
                row = ExamSubmission.builder()
                        .courseCode(courseCode)
                        .examType(exam.getExamType())
                        .rollNumber(rollNumber)
                        .studentEmail(studentEmail)
                        .startedAt(LocalDateTime.now())
                        .build();
            }

            row.setSubmissionContent(submissionContent.trim());
            row.setSubmittedAt(LocalDateTime.now());
            row.setLate(LocalDateTime.now().isAfter(exam.getExamDate()));
            return examSubmissionRepository.save(row);
        } catch (Exception e) {
            log.warn("Error in submitExam ({}): {}", e.getClass().getSimpleName(), e.getMessage());
            // Fallback: Use resilient query that handles duplicates by returning latest
            Optional<ExamSubmission> existing = examSubmissionRepository
                    .findLatestByCourseCodeAndExamTypeAndStudentEmail(courseCode, exam.getExamType(), studentEmail);
            if (existing.isPresent()) {
                ExamSubmission row = existing.get();
                if (row.getSubmittedAt() != null) {
                    throw new IllegalArgumentException("Student has already submitted for this exam");
                }
                row.setSubmissionContent(submissionContent.trim());
                row.setSubmittedAt(LocalDateTime.now());
                row.setLate(LocalDateTime.now().isAfter(exam.getExamDate()));
                return examSubmissionRepository.save(row);
            }
            // If no record at all, create a new one
            ExamSubmission row = ExamSubmission.builder()
                    .courseCode(courseCode)
                    .examType(exam.getExamType())
                    .rollNumber(rollNumber)
                    .studentEmail(studentEmail)
                    .startedAt(LocalDateTime.now())
                    .build();
            row.setSubmissionContent(submissionContent.trim());
            row.setSubmittedAt(LocalDateTime.now());
            row.setLate(LocalDateTime.now().isAfter(exam.getExamDate()));
            return examSubmissionRepository.save(row);
        }
    }

    private Exam resolveExam(String courseCode, String examType) {
        if (examType == null || examType.isBlank()) {
            throw new IllegalArgumentException("examType is required");
        }
        List<Exam> exams = examRepository.findByCourseCodeAndExamType(courseCode, examType);
        if (exams.isEmpty()) {
            throw new InvalidExamException("No " + examType + " exam found for course: " + courseCode);
        }
        return exams.get(exams.size() - 1);
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

    @Transactional
    public long resetAttempt(String courseCode, String examType, String rollNumber) {
        List<ExamSubmission> rows = examSubmissionRepository
                .findByCourseCodeAndExamTypeAndRollNumber(courseCode, examType, rollNumber);
        if (rows.isEmpty()) {
            return 0L;
        }
        examSubmissionRepository.deleteAll(rows);
        return rows.size();
    }
}
