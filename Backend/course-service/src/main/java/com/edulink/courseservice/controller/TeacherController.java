package com.edulink.courseservice.controller;
import com.edulink.courseservice.client.IdentityClient;
import com.edulink.courseservice.dto.*;
import com.edulink.courseservice.entity.*;
import com.edulink.courseservice.service.CourseService;
import com.edulink.courseservice.service.GridFsService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController @RequestMapping("/course/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    private final CourseService courseService;
    private final IdentityClient identityClient;
    private final GridFsService gridFsService;

    public TeacherController(CourseService courseService, IdentityClient identityClient, GridFsService gridFsService) {
        this.courseService = courseService;
        this.identityClient = identityClient;
        this.gridFsService = gridFsService;
    }

    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<ClassRoom>>> getClasses(Authentication auth) {
        String email = auth.getName();
        List<ClassRoom> classes = courseService.getClassesByTeacher(email);
        return ResponseEntity.ok(ApiResponse.success("Classes retrieved", classes));
    }

    /** Courses offered in a specific class — drives the cascading dropdown on assignment/exam creation. */
    @GetMapping("/courses-by-class/{classId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved", courseService.getCoursesByClassId(classId)));
    }

    @PostMapping("/upload-material")
    public ResponseEntity<ApiResponse<LearningMaterialDto>> uploadMaterial(
            @RequestParam String courseCode,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String materialType,
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        try {

            System.out.println("I am in upload material");
            // Upload file to GridFS
            String fileId = gridFsService.uploadFile(file, courseCode);

            // Create LearningMaterial entity with metadata
            LearningMaterial material = LearningMaterial.builder()
                    .courseCode(courseCode)
                    .teacherEmail(auth.getName())
                    .title(title)
                    .description(description)
                    .fileId(fileId)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .materialType(materialType)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            // Save metadata to MySQL
            LearningMaterial saved = courseService.uploadMaterial(material);

            // Convert to DTO
            LearningMaterialDto dto = new LearningMaterialDto(
                    saved.getCourseCode(), saved.getTeacherEmail(), saved.getTitle(),
                    saved.getDescription(), saved.getFileId(), saved.getFileName(),
                    saved.getFileSize(), saved.getContentType(), saved.getMaterialType(),
                    saved.getUploadedAt()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Learning material uploaded successfully", dto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/materials/{courseCode}")
    public ResponseEntity<ApiResponse<List<LearningMaterial>>> getCourseMaterials(@PathVariable String courseCode) {
        List<LearningMaterial> materials = courseService.getMaterialsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Learning materials retrieved", materials));
    }

    @GetMapping("/materials/download/{fileId}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable String fileId) {
        try {
            byte[] fileContent = gridFsService.downloadFile(fileId);
            String fileName = gridFsService.getFileName(fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping("/materials/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(@PathVariable String fileId, Authentication auth) {
        try {
            // Verify ownership - get the material and check if teacher owns it
            // (You may want to add this check based on your requirements)

            gridFsService.deleteFile(fileId);
            courseService.deleteMaterialByFileId(fileId);

            return ResponseEntity.ok(ApiResponse.success("Material deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete material: " + e.getMessage()));
        }
    }

    /** Every assignment the authenticated teacher has created (across all courses). */
    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getMyAssignments(Authentication auth) {
        List<Assignment> assignments = courseService.getAssignmentsByTeacherEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved", assignments));
    }

    @PostMapping(value = "/create-assignment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(@Valid @ModelAttribute CreateAssignmentRequest request, Authentication auth) {
        try {
            Assignment assignment = courseService.createAssignment(request, auth.getName());
            return ResponseEntity.ok(ApiResponse.success("Assignment created", assignment));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload questions file: " + e.getMessage()));
        }
    }

    @GetMapping("/assignments/download/{fileId}")
    public ResponseEntity<Resource> downloadAssignmentSubmission(@PathVariable String fileId) {
        try {
            byte[] fileContent = gridFsService.downloadFile(fileId);
            String fileName = gridFsService.getFileName(fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/create-exam")
    public ResponseEntity<ApiResponse<Object>> createExam(@RequestBody Object exam) {
        return ResponseEntity.ok(ApiResponse.success("Exam created (see exam-service)", exam));
    }

    @PostMapping("/grade-student")
    public ResponseEntity<ApiResponse<Object>> gradeStudent(@RequestBody Object gradeRequest) {
        return ResponseEntity.ok(ApiResponse.success("Grade submitted (see exam-service)", gradeRequest));
    }

    @GetMapping("/students/{classId}")
    public ResponseEntity<ApiResponse<List<UserDto>>> getStudents(
            @PathVariable Long classId,
            @RequestHeader("Authorization") String authorization,
            Authentication auth) {
        String email = auth.getName();
        // Get the class to find schoolId
        List<ClassRoom> classes = courseService.getClassesByTeacher(email);
        ClassRoom classRoom = classes.stream()
                .filter(c -> c.getId().equals(classId))
                .findFirst()
                .orElse(null);
        if (classRoom == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Class not found or not assigned to teacher"));
        }
        String schoolId = classRoom.getSchoolId();
        ApiResponse<List<UserDto>> response = identityClient.getStudentsByClassAndSchool(classId, schoolId, authorization);
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Students in class " + classId + " retrieved", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(response.getMessage()));
        }
    }
}