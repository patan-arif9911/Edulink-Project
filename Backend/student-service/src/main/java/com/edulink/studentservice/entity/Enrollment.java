package com.edulink.studentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long studentId;

    @Column
    private String studentEmail;

    @NotNull
    @Column(nullable = false)
    private Long courseId;

    private String courseName;
    private String courseCode;

    @Column(nullable = false)
    private String status; // ACTIVE, COMPLETED, DROPPED

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        if (status == null || status.trim().isEmpty()) {
            status = "ACTIVE";
        }
    }
}
