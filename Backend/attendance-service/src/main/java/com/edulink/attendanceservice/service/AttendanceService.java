package com.edulink.attendanceservice.service;

import com.edulink.attendanceservice.dto.BulkMarkAttendanceRequest;
import com.edulink.attendanceservice.dto.MarkAttendanceRequest;
import com.edulink.attendanceservice.entity.Attendance;
import com.edulink.attendanceservice.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AttendanceService {

    /** Accepted status values. Backend keeps LATE/EXCUSED for backwards compatibility; UI surfaces OD. */
    private static final Set<String> ALLOWED_STATUSES = Set.of("PRESENT", "ABSENT", "OD", "LATE", "EXCUSED");

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    /** Mark or update a single student's attendance (upsert by rollNumber + courseId + date). */
    @Transactional
    public Attendance markAttendance(MarkAttendanceRequest req, String teacherEmail) {
        String status = normaliseStatus(req.getStatus());
        Attendance entity = attendanceRepository
                .findByRollNumberAndCourseIdAndAttendanceDate(
                        req.getRollNumber(), req.getCourseId(), req.getAttendanceDate())
                .map(existing -> {
                    existing.setStatus(status);
                    existing.setMarkedBy(teacherEmail);
                    existing.setSchoolId(req.getSchoolId());
                    return existing;
                })
                .orElseGet(() -> Attendance.builder()
                        .rollNumber(req.getRollNumber())
                        .courseId(req.getCourseId())
                        .schoolId(req.getSchoolId())
                        .attendanceDate(req.getAttendanceDate())
                        .status(status)
                        .markedBy(teacherEmail)
                        .build());
        return attendanceRepository.save(entity);
    }

    /** Mark or update attendance for an entire class on a given date in one transaction. */
    @Transactional
    public List<Attendance> markAttendanceBulk(BulkMarkAttendanceRequest req, String teacherEmail) {
        List<Attendance> saved = new ArrayList<>();
        for (BulkMarkAttendanceRequest.Entry entry : req.getEntries()) {
            String status = normaliseStatus(entry.getStatus());
            Optional<Attendance> existing = attendanceRepository
                    .findByRollNumberAndCourseIdAndAttendanceDate(
                            entry.getRollNumber(), req.getCourseId(), req.getAttendanceDate());
            Attendance row = existing.orElseGet(() -> Attendance.builder()
                    .rollNumber(entry.getRollNumber())
                    .courseId(req.getCourseId())
                    .schoolId(req.getSchoolId())
                    .attendanceDate(req.getAttendanceDate())
                    .build());
            row.setStatus(status);
            row.setMarkedBy(teacherEmail);
            row.setSchoolId(req.getSchoolId());
            saved.add(attendanceRepository.save(row));
        }
        return saved;
    }

    /** Fetch existing attendance for a class on a date so the UI can hydrate the table. */
    public List<Attendance> getAttendanceByClassAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, date);
    }

    public List<Attendance> getAttendanceByRollNumber(String rollNumber) {
        return attendanceRepository.findByRollNumber(rollNumber);
    }

    public List<Attendance> getAttendanceReport(String schoolId) {
        return attendanceRepository.findBySchoolId(schoolId);
    }

    public List<Attendance> getAttendanceByEmail(String email) {
        return attendanceRepository.findByMarkedBy(email);
    }

    private String normaliseStatus(String status) {
        if (status == null) {
            throw new IllegalArgumentException("status is required");
        }
        String upper = status.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(upper)) {
            throw new IllegalArgumentException(
                    "Invalid status '" + status + "'. Allowed: " + ALLOWED_STATUSES);
        }
        return upper;
    }
}
