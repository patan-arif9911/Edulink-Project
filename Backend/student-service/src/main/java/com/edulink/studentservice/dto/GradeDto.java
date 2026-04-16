package com.edulink.studentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GradeDto {
    private Long id;
    private String examId;
    private Long studentId;
    private String teacherEmail;
    private int marksObtained;
    private int totalMarks;
    private String grade;
    private String remarks;
    private LocalDateTime gradedAt;

}
