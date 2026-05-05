package com.edulink.complianceservice.controller;

import com.edulink.complianceservice.dto.ReportDto;
import com.edulink.complianceservice.dto.SchoolDto;
import com.edulink.complianceservice.dto.UserDto;

import com.edulink.complianceservice.entity.Rule;

import com.edulink.complianceservice.exception.ResourceNotCreateException;
import com.edulink.complianceservice.exception.ResourceNotFoundException;
import com.edulink.complianceservice.service.ComplianceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/compliance")
public class ComplianceController {


    @Autowired
    private ComplianceService complianceService;




    //This controller call the complianceService.addData function for add data
//    @PostMapping("/audit-school")
//    public ResponseEntity<ComplianceRecord> schoolAudit(@RequestBody @Valid ComplianceRecordDto schoolAssignDto)throws Exception{
//
//            ComplianceRecord getData=complianceService.addData(schoolAssignDto);
//            return ResponseEntity.ok(getData);
//    }
//
//    @GetMapping({"/audit-records","/compliance-status"})
//    public ResponseEntity<List<ComplianceRecord>> auditRecords(){
//        return ResponseEntity.ok(complianceService.getAll());
//    }

//    -----------------somthing new -------------------------------

    @GetMapping("/reports")
    public ResponseEntity<ReportDto> getReports(){
        return ResponseEntity.ok(complianceService.getReport());
    }

    @GetMapping("/getAllSchool")
    public ResponseEntity<List<SchoolDto>> getAllSchool(){
        return ResponseEntity.ok(complianceService.getAllSchool());
    }


    @PostMapping("/create-school")
    public ResponseEntity<SchoolDto> creteSchool(@RequestBody @Valid SchoolDto school) {
        SchoolDto newSchool=complianceService.creteSchool(school);

        return ResponseEntity.ok(newSchool);

    }

    //create School Admin
    @PostMapping("/create-school-admin")
    public ResponseEntity<UserDto> createSchoolAdmin(@RequestBody @Valid UserDto newUser){
        System.out.println("IN compliance controller");
        return ResponseEntity.ok(complianceService.createSchoolAdmin(newUser));
    }


    @GetMapping("/allRules")
    public ResponseEntity<List<Rule>> allRules(){
        return ResponseEntity.ok(complianceService.getRules());
    }

    @GetMapping("/allReviewRules")
    public ResponseEntity<List<Rule>> allReviewRules(){
        return ResponseEntity.ok(complianceService.getRules());
    }


    @PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
    @PutMapping("/rule-validate/{ruleId}/{status}")
    public ResponseEntity<Rule> validateRule(@PathVariable Long ruleId,@PathVariable String status){
       return ResponseEntity.ok(complianceService.validateRule(ruleId,status));

    }


}
