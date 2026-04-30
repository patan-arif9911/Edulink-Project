package com.edulink.identityservice.controller;
import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.Role;
import com.edulink.identityservice.service.UserManagementService;
import com.edulink.identityservice.util.JwtExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('SCHOOL_ADMIN')")
public class AdminController {

    private final UserManagementService userManagementService;
    private final JwtExtractor jwtExtractor;

    public AdminController(UserManagementService userManagementService, JwtExtractor jwtExtractor) {
        this.userManagementService = userManagementService;
        this.jwtExtractor = jwtExtractor;
    }

    @PostMapping("/create-teacher")
    public ResponseEntity<ApiResponse<UserResponse>> createTeacher(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        request.setRole(Role.TEACHER);
        // Auto-derive schoolId from admin's JWT
        String schoolId = jwtExtractor.extractSchoolId(req);
        if (schoolId != null && (request.getSchoolId() == null || request.getSchoolId().isEmpty())) {
            request.setSchoolId(schoolId);
        }
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher account created. Temporary password: " + response.getTemporaryPassword(), response));
    }

    @PostMapping("/create-student")
    public ResponseEntity<ApiResponse<UserResponse>> createStudent(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        request.setRole(Role.STUDENT);
        // Auto-derive schoolId from admin's JWT
        String schoolId = jwtExtractor.extractSchoolId(req);
        if (schoolId != null && (request.getSchoolId() == null || request.getSchoolId().isEmpty())) {
            request.setSchoolId(schoolId);
        }
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student account created. Temporary password: " + response.getTemporaryPassword(), response));
    }

    @GetMapping("/teachers")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getTeachers() {
        return ResponseEntity.ok(ApiResponse.success("Teachers retrieved",
                userManagementService.getUsersByRole(Role.TEACHER)));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getStudents() {
        return ResponseEntity.ok(ApiResponse.success("Students retrieved",
                userManagementService.getUsersByRole(Role.STUDENT)));
    }

    @DeleteMapping("/delete-teacher/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeacher(@PathVariable String id) {
        userManagementService.deleteUser(id, Role.TEACHER);
        return ResponseEntity.ok(ApiResponse.success("Teacher deleted successfully", null));
    }

    @DeleteMapping("/delete-student/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable String id) {
        userManagementService.deleteUser(id, Role.STUDENT);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}
