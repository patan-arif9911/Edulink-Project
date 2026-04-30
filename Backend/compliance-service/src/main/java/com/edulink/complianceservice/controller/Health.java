package com.edulink.complianceservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Health {

    @GetMapping("/health")
    public String health(){
        return "I am running in compliance service";
    }
}
