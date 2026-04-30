//package com.edulink.complianceservice.dto;
//
//
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import org.springframework.stereotype.Component;
//
//@Component
//public class ComplianceRecordDto {
//
//    @NotBlank(message = "schoolId not fill")
//    private String anotherId;
//    private String auditType;
//
//    @Email(message = "Email not fill")
//    private String auditorEmail;
//
//    @NotBlank(message = "status not fill")
//    private String status;
//    private String recommendations;
//
//    public ComplianceRecordDto(){
//
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
//}
