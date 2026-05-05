package com.edulink.complianceservice.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class RuleDto {
    private long id;



    @NotNull(message = "ruleType not valid")
    private String ruleType;
    private String boardOfficerId;

    private String complianceOfferId;

    @NotNull(message = "ruleConfig not valid")
    private String ruleConfig;

    private String status;
    private  boolean active;

    private Date ruleCreate;
    private Date ruleActive;

    public RuleDto(){

    }

    public Date getRuleActive() {
        return ruleActive;
    }

    public void setRuleActive(Date ruleActive) {
        this.ruleActive = ruleActive;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public @NotNull(message = "ruleType not valid") String getRuleType() {
        return ruleType;
    }

    public void setRuleType(@NotNull(message = "ruleType not valid") String ruleType) {
        this.ruleType = ruleType;
    }

    public @NotNull(message = "boardOfficerId not valid") String getBoardOfficerId() {
        return boardOfficerId;
    }

    public void setBoardOfficerId(@NotNull(message = "boardOfficerId not valid") String boardOfficerId) {
        this.boardOfficerId = boardOfficerId;
    }

    public String getComplianceOfferId() {
        return complianceOfferId;
    }

    public void setComplianceOfferId(String complianceOfferId) {
        this.complianceOfferId = complianceOfferId;
    }

    public @NotNull(message = "ruleConfig not valid") String getRuleConfig() {
        return ruleConfig;
    }

    public void setRuleConfig(@NotNull(message = "ruleConfig not valid") String ruleConfig) {
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

    public Date getRuleCreate() {
        return ruleCreate;
    }

    public void setRuleCreate(Date ruleCreate) {
        this.ruleCreate = ruleCreate;
    }
}
