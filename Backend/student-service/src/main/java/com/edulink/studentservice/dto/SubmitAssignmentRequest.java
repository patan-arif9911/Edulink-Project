package com.edulink.studentservice.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAssignmentRequest {
    @NotNull private Integer assignmentNum;
    @NotBlank private String courseCode;
    @NotBlank(message = "assignmentTitle is required")
    private String assignmentTitle;
    private String submissionContent;
    private String fileUrl;


    @AssertTrue(message = "Either submissionContent or fileUrl is required")
    public boolean isSubmissionProvided() {
        return hasText(submissionContent) || hasText(fileUrl);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
