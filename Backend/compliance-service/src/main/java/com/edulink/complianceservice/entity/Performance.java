//package com.edulink.complianceservice.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//
//@Entity
//public class Performance {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long id;
//
//    private String schoolId;
//    private int passRate;
//    private int overAllRateA;
//    private int overAllRateB;
//    private int overAllRateC;
//
//    public Performance(){
//
//    }
//
//    public long getId() {
//        return id;
//    }
//
//    public void setId(long id) {
//        this.id = id;
//    }
//
//    public String getSchoolId() {
//        return schoolId;
//    }
//
//    public void setSchoolId(String schoolId) {
//        this.schoolId = schoolId;
//    }
//
//    public int getPassRate() {
//        return passRate;
//    }
//
//    public void setPassRate(int passRate) {
//        this.passRate = passRate;
//    }
//
//    public int getOverAllRateA() {
//        return overAllRateA;
//    }
//
//    public void setOverAllRateA(int overAllRateA) {
//        this.overAllRateA = overAllRateA;
//    }
//
//    public int getOverAllRateB() {
//        return overAllRateB;
//    }
//
//    public void setOverAllRateB(int overAllRateB) {
//        this.overAllRateB = overAllRateB;
//    }
//
//    public int getOverAllRateC() {
//        return overAllRateC;
//    }
//
//    public void setOverAllRateC(int overAllRateC) {
//        this.overAllRateC = overAllRateC;
//    }
//}
