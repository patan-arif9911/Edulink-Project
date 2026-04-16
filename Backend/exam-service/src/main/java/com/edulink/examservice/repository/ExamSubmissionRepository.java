package com.edulink.examservice.repository;

import com.edulink.examservice.entity.ExamSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ExamSubmissionRepository extends JpaRepository<ExamSubmission, Long> {

    List<ExamSubmission> findByExamId(String examId);

    List<ExamSubmission> findByStudentEmail(String studentEmail);

    Optional<ExamSubmission> findByExamIdAndStudentEmail(String examId, String studentEmail);

    boolean existsByExamIdAndStudentEmail(String examId, String studentEmail);

    @Query("SELECT es FROM ExamSubmission es WHERE es.examId IN :examIds")
    List<ExamSubmission> findByExamIds(@Param("examIds") List<String> examIds);
}