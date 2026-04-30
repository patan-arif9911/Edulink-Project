package com.edulink.complianceservice.service;


import com.edulink.complianceservice.client.SchoolClient;
import com.edulink.complianceservice.dto.*;

import com.edulink.complianceservice.entity.Rule;

import com.edulink.complianceservice.exception.ResourceNotFoundException;

import com.edulink.complianceservice.repository.RuleRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;


@Service
public class BoardService {


    @Autowired
    private SchoolClient schoolClient;

    @Autowired
    private RuleRepository ruleRepository;

//    public SchoolDto getSchoolById(String schoolId)throws ResourceFoundException {
//        ResponseEntity<ApiResponse<SchoolDto>> res=schoolClient.getSchoolById(schoolId);
//        ApiResponse<SchoolDto> body=res.getBody();
//        if(body==null || body.getData()==null){
//            throw new ResourceFoundException("Resource is not available");
//        }
//        return body.getData();
//    }

//    public Performance saveData(PerformanceDto performanceDto)throws ResourceCreateException {
//        Performance tem=performanceDto.getPerformance();
//        tem.setSchoolId(performanceDto.getSchoolId());
//        return performanceRepository.save(tem);
//    }
//
//    public List<Performance> getAllData()throws ResourceFoundException{
//        List<Performance>  allData=performanceRepository.findAll();
//        if(allData.isEmpty()){
//            throw new ResourceFoundException("Resource is not available");
//        }
//        return allData;
//    }

//    public Map<String, String> getAllReport(String schoolId) throws ResourceFoundException {
//
//        ResponseEntity<ApiResponse<SchoolDto>> res = schoolClient.getSchoolById(schoolId);
//
//        if (res.getBody() == null || res.getBody().getData() == null) {
//            throw new ResourceFoundException("Resource is not available");
//        }
//
//        SchoolDto school = res.getBody().getData();
//        long totalTeacherCount = 0;
//        long totalStudentCount = 0;
//        HashMap<String,String> tem=new HashMap<>();
//        tem.put("schoolName",school.getName());
//        tem.put("totalTeacher",school.getTeacherNumber()+"");
//        tem.put("totalStudent",school.getStudentNumber()+"");
//
//        return tem;
//    }

   // --------------------------something new----------------------------------

    public List<Rule> getRules(){
        return ruleRepository.findAll();
    }

    public Map<String,Integer> getUsers(){
        Map<String,Integer> user=schoolClient.getUsers().getBody();
        return  user;
    }

    public ReportDto getReport(){
        List<Rule> allRules=getRules();
        int live=0;
        int reject=0;
        int accept=0;
        int pending=0;
        for(Rule r:allRules){
            if(r.isActive()){
                live++;
            }else if(r.getStatus().equalsIgnoreCase("approved") && !r.isActive()){
                accept++;
            }else if(r.getStatus().equals("rejected")){
                reject++;
            }else if(r.getStatus().equals("pending")){
                pending++;
            }
        }

        ReportDto report=new ReportDto();

        report.setLiveRules(live);
        report.setRejectedRules(reject);
        report.setAcceptedRules(accept);
        report.setPendingRules(pending);

        return report;
    }

    public Rule rulesCreate(RuleDto ruleDto){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Rule newRule=new Rule();
        newRule.setRuleType(ruleDto.getRuleType());
        newRule.setBoardOfficerId(email);
        newRule.setRuleConfig(ruleDto.getRuleConfig());

        return ruleRepository.save(newRule);

    }

    public Rule activeRule(Long ruleId,boolean active)throws ResourceNotFoundException {
        Rule temRule=ruleRepository.findById(ruleId).orElseThrow(()->new ResourceNotFoundException("Rule does not exist with id = "+ruleId));
        temRule.setActive(active);
        return ruleRepository.save(temRule);
    }



}
