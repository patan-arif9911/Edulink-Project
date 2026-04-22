package com.edulink.examservice.config;
import com.edulink.examservice.entity.*;
import com.edulink.examservice.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Configuration
public class DataInitializer {
    private final ExamRepository examRepo;
    private final GradeRepository gradeRepo;
    private final JdbcTemplate jdbcTemplate;
    private static final Logger log = Logger.getLogger(DataInitializer.class.getName());

    public DataInitializer(ExamRepository examRepo, GradeRepository gradeRepo, JdbcTemplate jdbcTemplate) {
        this.examRepo = examRepo;
        this.gradeRepo = gradeRepo;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Bean
    public CommandLineRunner init() {
        return args -> {
            // Drop legacy columns if they still exist
            dropColumnIfExists("grades", "exam_id");
            dropColumnIfExists("grades", "student_id");
            dropColumnIfExists("exam_submissions", "exam_id");

            Exam e1;
            if (examRepo.findByCourseCode("MATH101").isEmpty()) {
                e1 = examRepo.save(Exam.builder().courseCode("MATH101").teacherEmail("teacher@greenwood.edu")
                        .examTitle("Mid-Term Mathematics").examType("MID_TERM")
                        .totalMarks(100).passingMarks(35).schoolId("SCH001")
                        .examDate(LocalDateTime.now().plusDays(30)).build());
            } else {
                e1 = examRepo.findByCourseCode("MATH101").get(0);
            }

            if (gradeRepo.findByRollNumber("SCH001101").isEmpty()) {
                gradeRepo.save(Grade.builder()
                        .courseCode(e1.getCourseCode())
                        .examType(e1.getExamType())
                        .rollNumber("SCH001101")
                        .studentEmail("student@greenwood.edu")
                        .teacherEmail("teacher@greenwood.edu")
                        .marksObtained(85).totalMarks(100).passingMarks(35)
                        .grade("A").remarks("Excellent performance").build());
                log.info("==> Exam sample data initialized");
            }
        };
    }

    private void dropColumnIfExists(String table, String column) {
        try {
            // Check if column exists in information_schema
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, table, column);
            if (count != null && count > 0) {
                jdbcTemplate.execute("ALTER TABLE `" + table + "` DROP COLUMN `" + column + "`");
                log.info("==> Dropped legacy column: " + table + "." + column);
            }
        } catch (Exception e) {
            log.warning("Could not drop column " + table + "." + column + ": " + e.getMessage());
        }
    }
}
