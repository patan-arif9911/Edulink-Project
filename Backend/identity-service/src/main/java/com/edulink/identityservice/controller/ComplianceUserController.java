package com.edulink.identityservice.controller;

import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.Role;
import com.edulink.identityservice.entity.School;
import com.edulink.identityservice.service.ComplianceService;
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
import java.util.Map;

@RestController
@RequestMapping("/compliance/identity")
@PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
public class ComplianceUserController {

    private final UserManagementService userManagementService;
    private final JwtExtractor jwtExtractor;
    private final ComplianceService complianceService;

    public ComplianceUserController(UserManagementService userManagementService, JwtExtractor jwtExtractor,ComplianceService complianceService) {
        this.userManagementService = userManagementService;
        this.jwtExtractor = jwtExtractor;
        this.complianceService=complianceService;
    }

    @GetMapping("/usersStatus")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String,Integer>> getUsers(){
        return ResponseEntity.ok(complianceService.getUsers());
    }

    @PostMapping("/create-school-admin")
    public ResponseEntity<ApiResponse<UserResponse>> createSchoolAdmin(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        System.out.println("IN identify controller");
        request.setRole(Role.SCHOOL_ADMIN);
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School Admin created successfully", response));
    }

    @PostMapping("/create-school")
    public ResponseEntity<ApiResponse<School>> createSchool(
            Authentication auth, @Valid @RequestBody SchoolCreateRequest request) {
        School school = userManagementService.createSchool(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School created successfully", school));
    }

    @GetMapping("/schools/{schoolId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<School>> getSchoolById(@PathVariable String schoolId) {
        School school = userManagementService.getSchoolById(schoolId);
        return ResponseEntity.ok(ApiResponse.success("School retrieved successfully", school));
    }

    @GetMapping("/schools")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<School>>> getAllSchools() {
        List<School> schools = userManagementService.getAllSchools();
        return ResponseEntity.ok(ApiResponse.success("Schools retrieved successfully", schools));
    }
}
