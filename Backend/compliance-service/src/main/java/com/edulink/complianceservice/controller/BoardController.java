package com.edulink.complianceservice.controller;
import com.edulink.complianceservice.client.IdentityServiceClient;
import com.edulink.complianceservice.dto.ApiResponse;
import com.edulink.complianceservice.dto.IdentityApiResponse;
import com.edulink.complianceservice.dto.SchoolDto;
import com.edulink.complianceservice.entity.ComplianceRecord;
import com.edulink.complianceservice.repository.ComplianceRecordRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/board")
@PreAuthorize("hasRole('EDUCATION_BOARD_OFFICER')")
public class BoardController {

    @Autowired
    private ComplianceRecordRepository complianceRepo;

    @Autowired
    private IdentityServiceClient identityServiceClient;

    public BoardController(ComplianceRecordRepository complianceRepo) {
        this.complianceRepo = complianceRepo;
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @GetMapping("/schools")
    public ResponseEntity<ApiResponse<List<SchoolDto>>> getSchools(HttpServletRequest httpRequest) {
        String token = extractToken(httpRequest);

        IdentityApiResponse<List<SchoolDto>> response =
            identityServiceClient.getAllSchools(token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Schools retrieved", response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(response.getMessage()));
        }
    }

    @GetMapping("/academic-performance")
    public ResponseEntity<ApiResponse<Object>> academicPerformance() {
        Map<String,Object> perf = Map.of(
            "averagePassRate","87.5%", "topPerformingSchool","Greenwood High School",
            "overallGradeA","42%", "overallGradeB","35%", "overallGradeC","23%");
        return ResponseEntity.ok(ApiResponse.success("Academic performance", perf));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Object>> getReports() {
        return ResponseEntity.ok(ApiResponse.success("Board reports", Map.of("totalSchools", 2, "totalStudents", 830, "totalTeachers", 60)));
    }

    @GetMapping("/compliance-summary")
    public ResponseEntity<ApiResponse<List<ComplianceRecord>>> complianceSummary() {
        return ResponseEntity.ok(ApiResponse.success("Compliance summary", complianceRepo.findAll()));
    }
}
