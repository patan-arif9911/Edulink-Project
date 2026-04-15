package com.edulink.courseservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "learning_materials")
public class LearningMaterial {
    @Id
    private String id;
    private String courseCode;
    private String teacherEmail;
    private String title;
    private String description;
    private String fileId;          // GridFS file ID
    private String fileName;        // Original file name
    private Long fileSize;          // File size in bytes
    private String contentType;     // MIME type
    private String materialType;    // PDF, VIDEO, LINK, DOCUMENT
    private LocalDateTime uploadedAt;


    public LearningMaterial() {
    }

    public LearningMaterial(String id, String courseCode, String teacherEmail, String title, String description,
                            String fileId, String fileName, Long fileSize, String contentType,
                            String materialType, LocalDateTime uploadedAt) {
        this.id = id;
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

    public LearningMaterial(String courseCode, String teacherEmail, String title, String description,
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
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

        public Builder id(String id) { this.id = id; return this; }
        public Builder courseCode(String courseCode) { this.courseCode = courseCode; return this; }
        public Builder teacherEmail(String teacherEmail) { this.teacherEmail = teacherEmail; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder fileId(String fileId) { this.fileId = fileId; return this; }
        public Builder fileName(String fileName) { this.fileName = fileName; return this; }
        public Builder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }
        public Builder contentType(String contentType) { this.contentType = contentType; return this; }
        public Builder materialType(String materialType) { this.materialType = materialType; return this; }
        public Builder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }

        public LearningMaterial build() {
            return new LearningMaterial(id, courseCode, teacherEmail, title, description, fileId, fileName,
                fileSize, contentType, materialType, uploadedAt);
        }
    }
}
