package com.edulink.complianceservice.service;



import com.edulink.complianceservice.client.SchoolClient;
import com.edulink.complianceservice.dto.ApiResponse;
import com.edulink.complianceservice.dto.ReportDto;
import com.edulink.complianceservice.dto.SchoolDto;
import com.edulink.complianceservice.dto.UserDto;
import com.edulink.complianceservice.entity.Rule;

import com.edulink.complianceservice.exception.ResourceNotCreateException;
import com.edulink.complianceservice.exception.ResourceNotFoundException;

import com.edulink.complianceservice.repository.RuleRepository;

import com.edulink.complianceservice.utils.TokenContext;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComplianceService {




    @Autowired
    private RuleRepository ruleRepository;

    @Autowired
    private SchoolClient schoolClient;


    @Autowired
    private BoardService boardService ;





    //This service save record in Compliance_record table
//    public ComplianceRecord addData(ComplianceRecordDto schoolAudit)throws ResourceCreateException{
//        ComplianceRecord temp=new ComplianceRecord();
//        temp.setAnotherId(schoolAudit.getAnotherId());
//        temp.setAuditType(schoolAudit.getAuditType());
//        temp.setAuditorEmail(schoolAudit.getAuditorEmail());
//        temp.setStatus(schoolAudit.getStatus());
//        return complianceRecordRepository.save(temp);
//    }
//
//    public List<ComplianceRecord> getAll()throws ResourceFoundException {
//        List<ComplianceRecord>  allData=complianceRecordRepository.findAll();
//        if(allData.isEmpty()){
//            throw new ResourceFoundException("Resource is not available");
//        }
//        return allData;
//    }

//    -----------------Something new---------------------------------


    public UserDto createSchoolAdmin(UserDto newUser)throws ResourceNotFoundException {
        System.out.println("IN compliance service");
        String token="Bearer "+ TokenContext.getToken();
        ResponseEntity<ApiResponse<UserDto>> tem=schoolClient.createSchoolAdmin(token,newUser);

        if (tem.getBody() == null) {

            throw new ResourceNotFoundException("Empty response from School Service");
        }

        if (tem.getBody().getData() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return tem.getBody().getData();
    }

    public List<SchoolDto> getAllSchool(){
        return schoolClient.getAllSchools().getBody().getData();
    }

    public SchoolDto creteSchool( SchoolDto school)throws ResourceNotCreateException{
        SchoolDto newSchool= schoolClient.createSchool(school).getBody().getData();
        if(newSchool==null){
            throw new ResourceNotCreateException("School Not create");
        }

        return newSchool;

    }


    public List<Rule> getRules(){
        return ruleRepository.findAll();
    }

    public List<Rule> allReviewRules(){
        List<Rule> reviewRules= ruleRepository.findAll();
        List<Rule> newRules=new ArrayList<>();
        for(Rule r:reviewRules){
           if(r.getStatus().equalsIgnoreCase("review")){
               newRules.add(r);
           }
        }
        return newRules;
    }

    public ReportDto getReport(){
        return boardService.getReport();
    }

    public Rule validateRule(Long ruleId,String status)throws ResourceNotFoundException {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Rule temRule=ruleRepository.findById(ruleId).orElseThrow(()->new ResourceNotFoundException("Rule does not exist with id = "+ruleId));
        temRule.setComplianceOfferId(email);
        temRule.setStatus(status);
        return ruleRepository.save(temRule);
    }




}
