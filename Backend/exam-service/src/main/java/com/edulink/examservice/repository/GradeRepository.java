package com.edulink.examservice.repository;
import com.edulink.examservice.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByRollNumber(String rollNumber);
    List<Grade> findByCourseCode(String courseCode);
    List<Grade> findByCourseCodeAndExamType(String courseCode, String examType);
    boolean existsByRollNumberAndCourseCodeAndExamType(String rollNumber, String courseCode, String examType);
}
