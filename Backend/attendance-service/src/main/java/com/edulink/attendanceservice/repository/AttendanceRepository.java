package com.edulink.attendanceservice.repository;

import com.edulink.attendanceservice.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByRollNumber(String rollNumber);
    List<Attendance> findBySchoolId(String schoolId);
    List<Attendance> findByCourseId(Long courseId);
    List<Attendance> findByMarkedBy(String email);
    List<Attendance> findByRollNumberAndCourseId(String rollNumber, Long courseId);
    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.courseId = :courseId AND a.rollNumber = :rollNumber ORDER BY a.attendanceDate DESC")
    List<Attendance> findStudentCourseHistory(@Param("courseId") Long courseId, @Param("rollNumber") String rollNumber);
}
