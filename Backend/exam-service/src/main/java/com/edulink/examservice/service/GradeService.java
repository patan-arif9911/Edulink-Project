package com.edulink.examservice.service;

import com.edulink.examservice.entity.Grade;
import com.edulink.examservice.repository.GradeRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.Optional;

@Service
public class GradeService {
    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public Grade gradeStudent(Grade grade) {
        // Extract teacher email from JWT
        String teacherEmail = (String) SecurityContextHolder.getContext()
                .getAuthentication().getDetails();
        grade.setTeacherEmail(teacherEmail);

        // Prevent duplicate grading for same student + course + examType
        if (gradeRepository.existsByRollNumberAndCourseCodeAndExamType(
                grade.getRollNumber(), grade.getCourseCode(), grade.getExamType())) {
            throw new IllegalArgumentException(
                "Student " + grade.getRollNumber() + " has already been graded for " +
                grade.getCourseCode() + " - " + grade.getExamType());
        }

        if (grade.getMarksObtained() < 0 || grade.getMarksObtained() > grade.getTotalMarks()) {
            throw new IllegalArgumentException("Invalid marks: marks obtained cannot exceed total marks");
        }

        // Auto-calculate grade letter based on percentage
        int percentage = (grade.getMarksObtained() * 100) / grade.getTotalMarks();
        if (percentage >= 90)      grade.setGrade("A");
        else if (percentage >= 80) grade.setGrade("B");
        else if (percentage >= 70) grade.setGrade("C");
        else if (percentage >= 60) grade.setGrade("D");
        else                       grade.setGrade("F");

        // Auto-set remarks if not provided
        if (grade.getRemarks() == null || grade.getRemarks().isBlank()) {
            grade.setRemarks(grade.getGrade().equals("F") ? "Needs improvement" : "Graded successfully");
        }

        // Set passing marks from total if not provided
        if (grade.getPassingMarks() == 0) {
            grade.setPassingMarks((int) (grade.getTotalMarks() * 0.4)); // default 40%
        }

        return gradeRepository.save(grade);
    }

    public List<Grade> getGradesByRollNumber(String rollNumber) {
        return gradeRepository.findByRollNumber(rollNumber);
    }

    public List<Grade> getGradesByCourseCode(String courseCode) {
        return gradeRepository.findByCourseCode(courseCode);
    }

    /** Used by the per-exam roster page to mark which students are already graded. */
    public List<Grade> getGradesByCourseCodeAndExamType(String courseCode, String examType) {
        return gradeRepository.findByCourseCodeAndExamType(courseCode, examType);
    }

    /** Used by the contextual evaluate page to detect already-graded state. */
    public Optional<Grade> getGradeForStudent(String courseCode, String examType, String rollNumber) {
        return gradeRepository.findByCourseCodeAndExamTypeAndRollNumber(courseCode, examType, rollNumber);
    }
}