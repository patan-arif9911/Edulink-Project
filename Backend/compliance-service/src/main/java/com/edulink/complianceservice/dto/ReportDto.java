package com.edulink.complianceservice.dto;

public class ReportDto {

    private int liveRules;
    private int pendingRules;
    private int rejectedRules;
    private int acceptedRules;
    private int reviewRules;

    public int getReviewRules() {
        return reviewRules;
    }

    public void setReviewRules(int reviewRules) {
        this.reviewRules = reviewRules;
    }

    public ReportDto(){

    }

    public int getLiveRules() {
        return liveRules;
    }

    public void setLiveRules(int liveRules) {
        this.liveRules = liveRules;
    }

    public int getPendingRules() {
        return pendingRules;
    }

    public void setPendingRules(int pendingRules) {
        this.pendingRules = pendingRules;
    }

    public int getRejectedRules() {
        return rejectedRules;
    }

    public void setRejectedRules(int rejectedRules) {
        this.rejectedRules = rejectedRules;
    }

    public int getAcceptedRules() {
        return acceptedRules;
    }

    public void setAcceptedRules(int acceptedRules) {
        this.acceptedRules = acceptedRules;
    }
}
