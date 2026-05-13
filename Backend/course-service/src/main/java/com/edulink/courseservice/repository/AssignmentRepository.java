package com.edulink.courseservice.repository;
import com.edulink.courseservice.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseCode(String courseCode);
    List<Assignment> findByCourseCodeOrderByAssignmentNumDesc(String courseCode);
    Assignment findByCourseCodeAndAssignmentNum(String courseCode, Integer assignmentNum);

    /** Backs the "My Assignments" browser — every assignment this teacher has created. */
    List<Assignment> findByTeacherEmail(String teacherEmail);
}
