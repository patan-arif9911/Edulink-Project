package com.edulink.examservice.repository;
import com.edulink.examservice.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseCode(String courseCode);
    List<Exam> findBySchoolId(String schoolId);
    List<Exam> findByCourseCodeIn(List<String> courseCodes);
}
