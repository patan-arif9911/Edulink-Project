package com.edulink.studentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long studentId;

    @NotNull
    @Column(nullable = false)
    private Integer assignmentNum;

    @NotBlank
    @Column(nullable = false)
    private String assignmentTitle;

    @NotBlank
    @Column(nullable = false)
    private String courseCode;

    /** Student's email (from JWT) — used for student-side "my grades" lookup. */
    private String studentEmail;

    /** Student's roll number (looked up from identity-service at submission time). */
    private String rollNumber;

    private String submissionContent;
    private String fileId; // GridFS file ID for uploaded assignments
    private String fileName; // Original file name

    @Column(nullable = false)
    private String status; // SUBMITTED, GRADED, LATE

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    /* ── Grading fields, populated by teacher's Evaluate Assignment Submission flow ── */
    private Integer marksObtained;
    private Integer maxMarks;           // snapshot of the assignment's max marks at grading time
    private String remarks;
    private String evaluatedBy;          // teacher's email
    private LocalDateTime evaluatedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null || status.trim().isEmpty()) {
            status = "SUBMITTED";
        }
    }
}
