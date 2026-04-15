package com.edulink.courseservice.dto;

public class UploadMaterialRequest {
    private String courseCode;
    private String title;
    private String description;
    private String materialType; // PDF, VIDEO, DOCUMENT, etc.

    public UploadMaterialRequest() {}

    public UploadMaterialRequest(String courseCode, String title, String description, String materialType) {
        this.courseCode = courseCode;
        this.title = title;
        this.description = description;
        this.materialType = materialType;
    }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMaterialType() { return materialType; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
}
