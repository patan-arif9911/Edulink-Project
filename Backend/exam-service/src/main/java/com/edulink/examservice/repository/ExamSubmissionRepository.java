package com.edulink.examservice.repository;

import com.edulink.examservice.entity.ExamSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ExamSubmissionRepository extends JpaRepository<ExamSubmission, Long> {

    List<ExamSubmission> findByCourseCode(String courseCode);

    List<ExamSubmission> findByStudentEmail(String studentEmail);

    List<ExamSubmission> findByRollNumber(String rollNumber);

    List<ExamSubmission> findByCourseCodeAndExamType(String courseCode, String examType);

    List<ExamSubmission> findByCourseCodeAndExamTypeAndRollNumber(
            String courseCode, String examType, String rollNumber);


    Optional<ExamSubmission> findByCourseCodeAndStudentEmail(String courseCode, String studentEmail);

    boolean existsByCourseCodeAndStudentEmailAndExamType(String courseCode, String studentEmail, String examType);

    /** Find an in-progress OR finalised submission for resumption / submit lookup. */
    Optional<ExamSubmission> findByCourseCodeAndExamTypeAndStudentEmail(
            String courseCode, String examType, String studentEmail);

    /** Resilient method: Find submission (handles potential duplicates by returning latest). */
    @Query(value = "SELECT * FROM exam_submissions " +
            "WHERE course_code = :courseCode AND exam_type = :examType AND student_email = :studentEmail " +
            "ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<ExamSubmission> findLatestByCourseCodeAndExamTypeAndStudentEmail(
            @Param("courseCode") String courseCode,
            @Param("examType") String examType,
            @Param("studentEmail") String studentEmail);

    @Query("SELECT es FROM ExamSubmission es WHERE es.courseCode IN :courseCodes")
    List<ExamSubmission> findByCourseCodes(@Param("courseCodes") List<String> courseCodes);
}