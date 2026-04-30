package com.edulink.complianceservice.controller;
import com.edulink.complianceservice.dto.ApiResponse;
import com.edulink.complianceservice.dto.RegulatorDto;
import com.edulink.complianceservice.entity.Regulator;
import com.edulink.complianceservice.entity.Rule;
import com.edulink.complianceservice.service.ComplianceService;
import com.edulink.complianceservice.service.RegulatorService;
import com.edulink.complianceservice.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//@PreAuthorize("hasRole('REGULATOR')") @RequiredArgsConstructor
@RestController
@RequestMapping("/regulator")

public class RegulatorController {


    @Autowired
    private ComplianceService complianceService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RegulatorService regulatorService;



//    @GetMapping("/compliance-report")
//    public ResponseEntity<ApiResponse<List<ComplianceRecord>>> complianceReport(){
//        return ResponseEntity.ok(ApiResponse.success("Compliance-Report",complianceService.getAll()));
//    }

//    @GetMapping("/accreditation-status/{schoolId}")
//    public ResponseEntity<Map<String,String>> accreditationStatus(@PathVariable String schoolId){
//        Map<String,String> tem=regulatorService.getAccreditationStatus(schoolId);
//        return ResponseEntity.ok(tem);
//    }

  //  ---------------------------------Something new --------------------------------------

    @GetMapping("/getRules")
    public ResponseEntity<List<Rule>> getRules(){
        return ResponseEntity.ok(regulatorService.getRules());
    }

    @GetMapping("/getActiveRules")
    public ResponseEntity<List<Rule>> getActiveRules(){
        return ResponseEntity.ok(regulatorService.getActiveRules());
    }

    @GetMapping("/getRegulator")
    public ResponseEntity<List<Regulator>> getRegulator(){
        return ResponseEntity.ok(regulatorService.getRegulator());
    }

    @PreAuthorize("hasRole('REGULATOR')")
    @PostMapping("/markRules")
    public ResponseEntity<Regulator> markRules(@RequestBody @Valid RegulatorDto regulatorDto){
        return ResponseEntity.ok(regulatorService.createRegulator(regulatorDto));
    }

}
