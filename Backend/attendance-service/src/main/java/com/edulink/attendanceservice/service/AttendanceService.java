package com.edulink.attendanceservice.service;

import com.edulink.attendanceservice.entity.Attendance;
import com.edulink.attendanceservice.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance markAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
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
}
