package com.edulink.complianceservice.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ruleType;

    private String boardOfficerId;
    private String complianceOfferId;

    @Column(columnDefinition = "TEXT")
    private String ruleConfig;

    private String status="pending";
    private  boolean active=false;
    private Date ruleCreate=new Date();
    private Date ruleActive;

    public Date getRuleCreate() {
        return ruleCreate;
    }

    public void setRuleCreate(Date ruleCreate) {
        this.ruleCreate = ruleCreate;
    }

    public Date getRuleActive() {
        return ruleActive;
    }

    public void setRuleActive(Date ruleActive) {
        this.ruleActive = ruleActive;
    }

    public String getBoardOfficerId() {
        return boardOfficerId;
    }

    public void setBoardOfficerId(String boardOfficerId) {
        this.boardOfficerId = boardOfficerId;
    }

    public String getComplianceOfferId() {
        return complianceOfferId;
    }

    public void setComplianceOfferId(String complianceOfferId) {
        this.complianceOfferId = complianceOfferId;
    }

    public Rule(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRuleType() {
        return ruleType;
    }

    public void setRuleType(String ruleType) {
        this.ruleType = ruleType;
    }

    public String getRuleConfig() {
        return ruleConfig;
    }

    public void setRuleConfig(String ruleConfig) {
        this.ruleConfig = ruleConfig;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
