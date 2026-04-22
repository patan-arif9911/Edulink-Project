package com.edulink.courseservice.controller;
import com.edulink.courseservice.dto.ApiResponse;
import com.edulink.courseservice.entity.LearningMaterial;
import com.edulink.courseservice.entity.Assignment;
import com.edulink.courseservice.service.CourseService;
import com.edulink.courseservice.service.GridFsService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController @RequestMapping("/course/student") @PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    private final CourseService courseService;
    private final GridFsService gridFsService;

    public StudentController(CourseService courseService, GridFsService gridFsService) {
        this.courseService = courseService;
        this.gridFsService = gridFsService;
    }

    @GetMapping("/materials/{courseCode}")
    public ResponseEntity<ApiResponse<List<LearningMaterial>>> getMaterials(@PathVariable String courseCode) {
        List<LearningMaterial> materials = courseService.getMaterialsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Materials retrieved", materials));
    }

    @GetMapping("/assignments/{courseCode}")
    public ResponseEntity<ApiResponse<List<Assignment>>> getAssignments(@PathVariable String courseCode) {
        List<Assignment> assignments = courseService.getAssignmentsByCourseCode(courseCode);
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved", assignments));
    }

    @GetMapping("/assignments/download-questions/{assignmentNum}/{courseCode}")
    public ResponseEntity<Resource> downloadAssignmentQuestions(@PathVariable int assignmentNum, @PathVariable String courseCode) {
        try {
            Assignment assignment = courseService.getAssignmentByNumAndCourse(assignmentNum, courseCode);
            if (assignment == null || assignment.getQuestionsFileId() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            byte[] fileContent = gridFsService.downloadFile(assignment.getQuestionsFileId());
            String fileName = gridFsService.getFileName(assignment.getQuestionsFileId());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/materials/download/{fileId}")
    public ResponseEntity<Resource> previewMaterial(@PathVariable String fileId) {
        try {
            byte[] fileContent = gridFsService.downloadFile(fileId);
            String fileName = gridFsService.getFileName(fileId);
            // Try to detect content type by file extension (simple check)
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (fileName != null && fileName.toLowerCase().endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if (fileName != null && (fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg"))) {
                mediaType = MediaType.IMAGE_JPEG;
            }
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(fileContent));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}