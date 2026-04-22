package com.edulink.complianceservice.controller;
import com.edulink.complianceservice.client.IdentityServiceClient;
import com.edulink.complianceservice.dto.ApiResponse;
import com.edulink.complianceservice.dto.CreateSchoolRequest;
import com.edulink.complianceservice.dto.IdentityApiResponse;
import com.edulink.complianceservice.dto.SchoolDto;
import com.edulink.complianceservice.entity.ComplianceRecord;
import com.edulink.complianceservice.repository.ComplianceRecordRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/compliance")
public class ComplianceController {

    @Autowired
    private ComplianceRecordRepository repo;
    
    @Autowired
    private IdentityServiceClient identityServiceClient;

    @PostMapping("/create-school")
    @PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
    public ResponseEntity<ApiResponse<SchoolDto>> createSchool(@RequestBody CreateSchoolRequest request, HttpServletRequest httpRequest) {
        // Extract token from request header
        String token = extractToken(httpRequest);

        // Call identity service
        IdentityApiResponse<SchoolDto> response =
            identityServiceClient.createSchool(request, token);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School created successfully", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(response.getMessage()));
        }
    }

    @GetMapping("/schools/{schoolId}")
    @PreAuthorize("hasRole('COMPLIANCE_OFFICER') or hasRole('EDUCATION_BOARD_OFFICER') or hasRole('REGULATOR')")
    public ResponseEntity<ApiResponse<SchoolDto>> getSchoolById(@PathVariable String schoolId, HttpServletRequest httpRequest) {
        String token = extractToken(httpRequest);

        IdentityApiResponse<SchoolDto> response =
            identityServiceClient.getSchoolById(schoolId, token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("School retrieved successfully", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(response.getMessage()));
        }
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @PostMapping("/audit-school")
    @PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
    public ResponseEntity<ApiResponse<ComplianceRecord>> auditSchool(
            Authentication auth, @RequestBody ComplianceRecord record) {
        record.setAuditorEmail(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("School audited", repo.save(record)));
    }

    @GetMapping("/compliance-status")
    @PreAuthorize("hasRole('COMPLIANCE_OFFICER') or hasRole('REGULATOR')")
    public ResponseEntity<ApiResponse<List<ComplianceRecord>>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success("Compliance status", repo.findAll()));
    }

    @GetMapping("/audit-records")
    @PreAuthorize("hasRole('COMPLIANCE_OFFICER') or hasRole('REGULATOR')")
    public ResponseEntity<ApiResponse<List<ComplianceRecord>>> getAuditRecords() {
        return ResponseEntity.ok(ApiResponse.success("Audit records", repo.findAll()));
    }
}
