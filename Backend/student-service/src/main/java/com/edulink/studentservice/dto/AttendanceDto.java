package com.edulink.studentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String schoolId;
    private LocalDate attendanceDate;
    private String status;
    private String markedBy;
    private LocalDateTime createdAt;

}
