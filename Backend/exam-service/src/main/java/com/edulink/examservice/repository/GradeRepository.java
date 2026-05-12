package com.edulink.examservice.repository;

import com.edulink.examservice.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByRollNumber(String rollNumber);
    List<Grade> findByCourseCode(String courseCode);
    List<Grade> findByCourseCodeAndExamType(String courseCode, String examType);
    boolean existsByRollNumberAndCourseCodeAndExamType(String rollNumber, String courseCode, String examType);

    /** Lookup for the contextual grade page: is this student already graded for this exam? */
    Optional<Grade> findByCourseCodeAndExamTypeAndRollNumber(String courseCode, String examType, String rollNumber);
}
