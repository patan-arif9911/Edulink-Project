//package com.edulink.complianceservice.entity;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name="audit")
//public class Audit {
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    private long Id;
//
//    @Column(unique = true, nullable = false)
//    private long officeId;
//    private String scope;
//    private String Finding;
//    private LocalDateTime date;
//    private String Status;
//    public Audit(){
//
//    }
//
//    public long getId() {
//        return Id;
//    }
//
//    public void setId(long id) {
//        Id = id;
//    }
//
//    public long getOfficeId() {
//        return officeId;
//    }
//
//    public void setOfficeId(long officeId) {
//        this.officeId = officeId;
//    }
//
//    public String getScope() {
//        return scope;
//    }
//
//    public void setScope(String scope) {
//        this.scope = scope;
//    }
//
//    public String getFinding() {
//        return Finding;
//    }
//
//    public void setFinding(String finding) {
//        Finding = finding;
//    }
//
//    public LocalDateTime getDate() {
//        return date;
//    }
//
//    public void setDate(LocalDateTime date) {
//        this.date = date;
//    }
//
//    public String getStatus() {
//        return Status;
//    }
//
//    public void setStatus(String status) {
//        Status = status;
//    }
//}
