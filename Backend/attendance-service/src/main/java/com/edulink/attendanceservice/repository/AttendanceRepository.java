package com.edulink.attendanceservice.repository;

import com.edulink.attendanceservice.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByRollNumber(String rollNumber);

    List<Attendance> findBySchoolId(String schoolId);

    List<Attendance> findByCourseId(Long courseId);

    List<Attendance> findByMarkedBy(String email);

    /** Pre-fill the teacher's attendance table for a class on a given date. */
    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate attendanceDate);

    /** Upsert lookup: a student may have at most one attendance row per course per date. */
    Optional<Attendance> findByRollNumberAndCourseIdAndAttendanceDate(
            String rollNumber, Long courseId, LocalDate attendanceDate);
}
