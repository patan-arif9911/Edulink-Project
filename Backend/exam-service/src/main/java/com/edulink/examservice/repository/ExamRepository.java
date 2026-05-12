package com.edulink.examservice.repository;
import com.edulink.examservice.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseCode(String courseCode);
    List<Exam> findBySchoolId(String schoolId);
    List<Exam> findByCourseCodeIn(List<String> courseCodes);

    /** Look up the specific exam a student is submitting against. Returns empty if no such exam type exists. */
    List<Exam> findByCourseCodeAndExamType(String courseCode, String examType);

    /** Backs the "My Exams" browser — every exam this teacher has created. */
    List<Exam> findByTeacherEmail(String teacherEmail);
}
