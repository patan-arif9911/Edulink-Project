package com.edulink.courseservice.service;
import com.edulink.courseservice.entity.*;
import com.edulink.courseservice.repository.*;
import com.edulink.courseservice.exception.ClassAlreadyExistsException;
import com.edulink.courseservice.exception.CourseAlreadyExistsException;
import com.edulink.courseservice.exception.CourseNotFoundException;
import com.edulink.courseservice.exception.SchoolNotFoundException;
import com.edulink.courseservice.dto.CreateAssignmentRequest;
import com.edulink.courseservice.service.GridFsService;
import org.springframework.stereotype.Service;
import com.edulink.courseservice.client.IdentityClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courseRepo;
    private final ClassRoomRepository classRepo;
    private final LearningMaterialRepository materialRepo;
    private final AssignmentRepository assignmentRepo;
    private final IdentityClient identityClient;
    private final GridFsService gridFsService;

    public CourseService(CourseRepository courseRepo, ClassRoomRepository classRepo,
                         LearningMaterialRepository materialRepo, AssignmentRepository assignmentRepo,
                         IdentityClient identityClient, GridFsService gridFsService) {
        this.courseRepo = courseRepo;
        this.classRepo = classRepo;
        this.materialRepo = materialRepo;
        this.assignmentRepo = assignmentRepo;
        this.identityClient = identityClient;
        this.gridFsService = gridFsService;
    }

    public Course createCourse(Course course) {
        if (course.getCourseCode() == null || course.getCourseCode().isEmpty()) {
            throw new IllegalArgumentException("Course code must be provided");
        }

        courseRepo.findByCourseCode(course.getCourseCode()).ifPresent(existing -> {
            throw new CourseAlreadyExistsException(course.getCourseCode());
        });

        if (course.getClassId() == null) {
            throw new IllegalArgumentException("classId must be provided in course payload");
        }

        // Auto-derive schoolId from the class
        ClassRoom classRoom = classRepo.findById(course.getClassId())
                .orElseThrow(() -> new IllegalArgumentException("Class not found with ID: " + course.getClassId()));
        course.setSchoolId(classRoom.getSchoolId());

        return courseRepo.save(course);
    }

    private void verifySchoolExists(String schoolId) {
        try {
            identityClient.getSchoolById(schoolId);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new SchoolNotFoundException(schoolId);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().is4xxClientError()) {
                throw new SchoolNotFoundException(schoolId);
            }
            throw ex;
        }
    }
    public ClassRoom createClass(ClassRoom c) {
        if (c.getClassName() == null || c.getClassName().isEmpty()) {
            throw new IllegalArgumentException("Class name must be provided");
        }

        if (classRepo.existsByClassName(c.getClassName())) {
            throw new ClassAlreadyExistsException(c.getClassName());
        }

        if (c.getSchoolId() == null || c.getSchoolId().isEmpty()) {
            throw new IllegalArgumentException("schoolId must be provided in class payload");
        }

        verifySchoolExists(c.getSchoolId());

        return classRepo.save(c);
    }
    public LearningMaterial uploadMaterial(LearningMaterial m) {
        if (m.getCourseCode() == null || m.getCourseCode().isEmpty()) {
            throw new IllegalArgumentException("courseCode must be provided when uploading learning material");
        }

        Course course = courseRepo.findByCourseCode(m.getCourseCode())
                .orElseThrow(() -> new CourseNotFoundException(m.getCourseCode()));
        m.setCourseCode(course.getCourseCode());

        return materialRepo.save(m);
    }
    public Assignment createAssignment(CreateAssignmentRequest request, String teacherEmail) throws IOException {
        courseRepo.findByCourseCode(request.getCourseCode())
                .orElseThrow(() -> new CourseNotFoundException(request.getCourseCode()));

        // Upload the questions file to GridFS
        String questionsFileId = null;
        if (request.getQuestionsFile() != null && !request.getQuestionsFile().isEmpty()) {
            questionsFileId = gridFsService.uploadFile(request.getQuestionsFile(), request.getCourseCode());
        }

        List<Assignment> existing = assignmentRepo.findByCourseCodeOrderByAssignmentNumDesc(request.getCourseCode());
        int nextNum = existing.isEmpty() ? 1 : existing.get(0).getAssignmentNum() + 1;

        Assignment assignment = Assignment.builder()
                .courseCode(request.getCourseCode())
                .teacherEmail(teacherEmail)
                .title(request.getTitle())
                .description(request.getDescription())
                .assignmentNum(nextNum)
                .dueDate(request.getDueDate())
                .maxMarks(request.getMaxMarks())
                .questionsFileId(questionsFileId)
                .build();

        return assignmentRepo.save(assignment);
    }

    public List<Course> getCoursesBySchool(String schoolId) { return courseRepo.findBySchoolId(schoolId); }

    /** Used by the create-exam / create-assignment forms: list courses offered to a specific class. */
    public List<Course> getCoursesByClassId(Long classId) { return courseRepo.findByClassId(classId); }
    public List<ClassRoom> getClassesBySchool(String schoolId) { return classRepo.findBySchoolId(schoolId); }
    public List<ClassRoom> getClassesByTeacher(String teacherEmail) { return classRepo.findByTeacherEmail(teacherEmail); }
    public List<LearningMaterial> getMaterialsByCourse(Long courseId) {
        Course course = courseRepo.findById(courseId).orElse(null);
        if (course == null) return new ArrayList<>();
        return materialRepo.findByCourseCode(course.getCourseCode());
    }
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        Course course = courseRepo.findById(courseId).orElse(null);
        if (course == null) return new ArrayList<>();
        return assignmentRepo.findByCourseCode(course.getCourseCode());
    }
    public List<LearningMaterial> getMaterialsByClassId(Long classId) {
        List<Course> courses = courseRepo.findByClassId(classId);
        List<LearningMaterial> materials = new ArrayList<>();
        for (Course course : courses) {
            materials.addAll(materialRepo.findByCourseCode(course.getCourseCode()));
        }
        return materials;
    }
    public List<Assignment> getAssignmentsByClassId(Long classId) {
        List<Course> courses = courseRepo.findByClassId(classId);
        List<Assignment> assignments = new ArrayList<>();
        for (Course course : courses) {
            assignments.addAll(assignmentRepo.findByCourseCode(course.getCourseCode()));
        }
        return assignments;
    }
    public List<LearningMaterial> getMaterialsByCourseId(Long courseId) {
        Course course = courseRepo.findById(courseId).orElse(null);
        if (course == null) return new ArrayList<>();
        return materialRepo.findByCourseCode(course.getCourseCode());
    }
    public List<LearningMaterial> getMaterialsByCourseCode(String courseCode) {
        return materialRepo.findByCourseCode(courseCode);
    }
    public List<Assignment> getAssignmentsByCourseId(Long courseId) {
        Course course = courseRepo.findById(courseId).orElse(null);
        if (course == null) return new ArrayList<>();
        return assignmentRepo.findByCourseCode(course.getCourseCode());
    }
    public List<Assignment> getAssignmentsByCourseCode(String courseCode) {
        return assignmentRepo.findByCourseCode(courseCode);
    }

    /** Every assignment this teacher has created across all their courses. */
    public List<Assignment> getAssignmentsByTeacherEmail(String teacherEmail) {
        return assignmentRepo.findByTeacherEmail(teacherEmail);
    }

    public Assignment getAssignmentByNumAndCourse(int assignmentNum, String courseCode) {
        return assignmentRepo.findByCourseCodeAndAssignmentNum(courseCode, assignmentNum);
    }

    public Assignment getAssignmentById(Long assignmentId) {
        return assignmentRepo.findById(assignmentId).orElse(null);
    }

    public Assignment getAssignmentByCourseAndNumber(String courseCode, Integer assignmentNum) {
        return assignmentRepo.findByCourseCodeAndAssignmentNum(courseCode, assignmentNum);
    }

    public Course getCourseByCode(String courseCode) {
        return courseRepo.findByCourseCode(courseCode).orElse(null);
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public void deleteMaterialByFileId(String fileId) {
        materialRepo.deleteByFileId(fileId);
    }
}
