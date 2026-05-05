package com.edulink.complianceservice.service;

import com.edulink.complianceservice.dto.RegulatorDto;

import com.edulink.complianceservice.entity.Regulator;
import com.edulink.complianceservice.entity.Rule;

import com.edulink.complianceservice.exception.ResourceNotFoundException;
import com.edulink.complianceservice.repository.RegulatorRepository;
import com.edulink.complianceservice.repository.RuleRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

import java.util.List;


@Service
public class RegulatorService {

    @Autowired
    private BoardService boardService;

    @Autowired
    private RegulatorRepository regulatorRepository;

    @Autowired
    private RuleRepository ruleRepository;



    public List<Rule> getRules(){
        return boardService.getRules();
    }

    public List<Regulator> getRegulator()
    {
        return regulatorRepository.findAll();
    }

    public List<Rule> getActiveRules(){
        List<Rule> temRules=boardService.getRules();
        List<Rule> resRules=new ArrayList<>();

        for(Rule r:temRules){
            if(r.isActive()){
                resRules.add(r);
            }
        }

        return resRules;
    }


    public Regulator createRegulator(RegulatorDto regulatorDto){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Regulator newRegulator=null;
        if(regulatorRepository.existsByRuleId(getRuleId(regulatorDto))>0){
            newRegulator=regulatorRepository.findByRuleId(regulatorDto.getRuleId()).orElseThrow(()->(new ResourceNotFoundException("Service Review Failed")));

        }else{
            newRegulator=new Regulator();
        }
        newRegulator.setRegulatorOfficer(email);
        newRegulator.setRuleId(regulatorDto.getRuleId());
        newRegulator.setFlag(regulatorDto.getFlag());
        newRegulator.setMessage(regulatorDto.getMessage());

        Rule rules= ruleRepository.findById(regulatorDto.getRuleId()).orElseThrow(()->(new ResourceNotFoundException("Rules not found")));
        rules.setReview(true);
        ruleRepository.save(rules);
        return regulatorRepository.save(newRegulator);

    }

    private static Long getRuleId(RegulatorDto regulatorDto) {
        return regulatorDto.getRuleId();
    }
}
