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
public class AssignmentDto {
    private Integer assignmentNum;
    private String courseCode;
    private String teacherEmail;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private int maxMarks;
    private LocalDateTime createdAt;
    private String questionsFileId;
}