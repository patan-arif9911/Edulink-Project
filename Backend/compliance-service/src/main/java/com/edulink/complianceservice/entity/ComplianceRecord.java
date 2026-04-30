//package com.edulink.complianceservice.entity;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "compliance_records")
//public class ComplianceRecord {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String anotherId;
//
//    private String auditType;
//
//    private String auditorEmail;
//
//    private String status;
//
//    private String recommendations;
//
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getAnotherId() {
//        return anotherId;
//    }
//
//    public void setAnotherId(String anotherId) {
//        this.anotherId = anotherId;
//    }
//
//    public String getAuditType() {
//        return auditType;
//    }
//
//    public void setAuditType(String auditType) {
//        this.auditType = auditType;
//    }
//
//    public String getAuditorEmail() {
//        return auditorEmail;
//    }
//
//    public void setAuditorEmail(String auditorEmail) {
//        this.auditorEmail = auditorEmail;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public String getRecommendations() {
//        return recommendations;
//    }
//
//    public void setRecommendations(String recommendations) {
//        this.recommendations = recommendations;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//}
