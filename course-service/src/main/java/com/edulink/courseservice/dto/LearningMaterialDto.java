package com.edulink.courseservice.dto;

import java.time.LocalDateTime;

public class LearningMaterialDto {
    private String courseCode;
    private String teacherEmail;
    private String title;
    private String description;
    private String fileId;
    private String fileName;
    private Long fileSize;
    private String contentType;
    private String materialType;
    private LocalDateTime uploadedAt;

    public LearningMaterialDto() {}

    public LearningMaterialDto(String courseCode, String teacherEmail, String title, String description,
                               String fileId, String fileName, Long fileSize, String contentType,
                               String materialType, LocalDateTime uploadedAt) {
        this.courseCode = courseCode;
        this.teacherEmail = teacherEmail;
        this.title = title;
        this.description = description;
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.materialType = materialType;
        this.uploadedAt = uploadedAt;
    }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getTeacherEmail() { return teacherEmail; }
    public void setTeacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public String getMaterialType() { return materialType; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
