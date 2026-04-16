package com.edulink.examservice.service;

import com.edulink.examservice.entity.Grade;
import com.edulink.examservice.repository.GradeRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
public class GradeService {
    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public Grade gradeStudent(Grade grade) {

        String teacherEmail = (String)
                SecurityContextHolder.getContext()
                        .getAuthentication().getDetails();
        grade.setTeacherEmail(teacherEmail);

        if (grade.getMarksObtained() < 0 ||
                grade.getMarksObtained() > grade.getTotalMarks()) {
            throw new IllegalArgumentException("Invalid marks");
        }

        int percentage =
                (grade.getMarksObtained() * 100) / grade.getTotalMarks();

        if (percentage >= 90) grade.setGrade("A");
        else if (percentage >= 80) grade.setGrade("B");
        else if (percentage >= 70) grade.setGrade("C");
        else if (percentage >= 60) grade.setGrade("D");
        else grade.setGrade("F");

        if (grade.getGrade().equals("F")) {
            grade.setRemarks("Needs improvement");
        }

        return gradeRepository.save(grade);
    }

    public List<Grade> getGradesByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }
}