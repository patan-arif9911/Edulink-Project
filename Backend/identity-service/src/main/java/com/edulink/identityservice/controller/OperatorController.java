package com.edulink.identityservice.controller;

import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.Role;
import com.edulink.identityservice.exception.EduLinkException;
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
@RequestMapping("/operator")
@PreAuthorize("hasRole('OPERATOR')")
public class OperatorController {

    private final UserManagementService userManagementService;
    private final JwtExtractor jwtExtractor;

    public OperatorController(UserManagementService userManagementService, JwtExtractor jwtExtractor) {
        this.userManagementService = userManagementService;
        this.jwtExtractor = jwtExtractor;
    }

    @PostMapping("/create-compliance-officer")
    public ResponseEntity<ApiResponse<UserResponse>> createComplianceOfficer(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        request.setRole(Role.COMPLIANCE_OFFICER);
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Compliance Officer created successfully", response));
    }

    @PostMapping("/create-board-officer")
    public ResponseEntity<ApiResponse<UserResponse>> createBoardOfficer(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        request.setRole(Role.EDUCATION_BOARD_OFFICER);
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Education Board Officer created successfully", response));
    }

    @PostMapping("/create-regulator")
    public ResponseEntity<ApiResponse<UserResponse>> createRegulator(
            HttpServletRequest req, Authentication auth, @Valid @RequestBody CreateUserRequest request) {
        request.setRole(Role.REGULATOR);
        String token = jwtExtractor.extractToken(req);
        UserResponse response = userManagementService.createUser(request, auth.getName(), token);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Regulator created successfully", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userManagementService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }
}
