package com.edulink.complianceservice.service;

import com.edulink.complianceservice.dto.RegulatorDto;

import com.edulink.complianceservice.entity.Regulator;
import com.edulink.complianceservice.entity.Rule;

import com.edulink.complianceservice.repository.RegulatorRepository;
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
        Regulator newRegulator=new Regulator();
        newRegulator.setRegulatorOfficer(email);
        newRegulator.setRuleId(regulatorDto.getRuleId());
        newRegulator.setFlag(regulatorDto.getFlag());
        newRegulator.setMessage(regulatorDto.getMessage());

        return regulatorRepository.save(newRegulator);
    }
}
