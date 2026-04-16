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
public class LearningMaterialDto {
    private String courseCode;
    private String teacherEmail;
    private String title;
    private String description;
    private String fileUrl;
    private String materialType;
    private LocalDateTime uploadedAt;

}