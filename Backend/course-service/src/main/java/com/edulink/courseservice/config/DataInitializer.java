package com.edulink.courseservice.config;
import com.edulink.courseservice.entity.*;
import com.edulink.courseservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    private final CourseRepository courseRepo;
    private final ClassRoomRepository classRepo;
    private final LearningMaterialRepository materialRepo;
    private final AssignmentRepository assignmentRepo;
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    public DataInitializer(CourseRepository courseRepo, ClassRoomRepository classRepo,
                           LearningMaterialRepository materialRepo, AssignmentRepository assignmentRepo) {
        this.courseRepo = courseRepo;
        this.classRepo = classRepo;
        this.materialRepo = materialRepo;
        this.assignmentRepo = assignmentRepo;
    }

    @Bean
    public CommandLineRunner init() {
        return args -> {
            // Create class first so we can reference its ID in courses
            ClassRoom classRoom = null;
            if (classRepo.count() == 0) {
                classRoom = classRepo.save(ClassRoom.builder().className("Class 10A").grade(10).section("A")
                        .schoolId("SCH001").teacherEmail("teacher@greenwood.edu.com").capacity(35).build());
                log.info("==> Sample class created with ID: {}", classRoom.getId());
            } else {
                classRoom = classRepo.findByClassName("Class 10A").orElse(null);
            }

            final Long sampleClassId = classRoom != null ? classRoom.getId() : null;

            Course math = courseRepo.findByCourseCode("MATH101").orElseGet(() ->
                    courseRepo.save(Course.builder().courseCode("MATH101").courseName("Mathematics Grade 10")
                            .description("Algebra, Geometry, Trigonometry").classId(sampleClassId).schoolId("SCH001").teacherId(6L)
                            .subject("Mathematics").grade("Grade 10").active(true).build()));

            if (courseRepo.count() == 1) {
                courseRepo.findByCourseCode("PHY101").orElseGet(() ->
                        courseRepo.save(Course.builder().courseCode("PHY101").courseName("Physics Grade 10")
                                .description("Mechanics and Waves").classId(sampleClassId).schoolId("SCH001").teacherId(6L)
                                .subject("Physics").grade("Grade 10").active(true).build()));
                courseRepo.findByCourseCode("ENG101").orElseGet(() ->
                        courseRepo.save(Course.builder().courseCode("ENG101").courseName("English Literature")
                                .description("Classic and Modern Literature").classId(sampleClassId).schoolId("SCH001").teacherId(6L)
                                .subject("English").grade("Grade 10").active(true).build()));
            }


            try {
                if (materialRepo.findByCourseCode("MATH101").isEmpty()) {
                    materialRepo.save(LearningMaterial.builder().courseCode("MATH101").teacherEmail("teacher@school.com")
                            .title("Chapter 1: Algebra Basics").description("Introduction to algebraic expressions")
                            .fileId("sample-file-id").fileName("ch1.pdf").fileSize(1024000L).contentType("application/pdf").materialType("PDF").build());
                }
            } catch (Exception ex) {
                log.warn("Skipping MongoDB learning material initialization because Mongo is unavailable: {}", ex.getMessage());
            }

            if (assignmentRepo.findByCourseCode("MATH101").isEmpty()) {
                assignmentRepo.save(Assignment.builder().courseCode("MATH101").teacherEmail("teacher@school.com")
                        .assignmentNum(1)
                        .title("Algebra Assignment 1").description("Solve equations 1-20").maxMarks(20)
                        .dueDate(LocalDateTime.now().plusDays(7)).build());
            }

            log.info("==> Course sample data initialized");
        };
    }
}
