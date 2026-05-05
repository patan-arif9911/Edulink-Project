package com.edulink.complianceservice.dto;

import jakarta.validation.constraints.NotNull;

public class RegulatorDto {
    private Long id;
    @NotNull(message="RuleId not valid")
    private Long ruleId;
    private String regulatorOfficer;
    private String flag;
    private String message;


    public RegulatorDto(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "RuleId not valid") Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(@NotNull(message = "RuleId not valid") Long ruleId) {
        this.ruleId = ruleId;
    }

    public String getRegulatorOfficer() {
        return regulatorOfficer;
    }

    public void setRegulatorOfficer(String regulatorOfficer) {
        this.regulatorOfficer = regulatorOfficer;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
