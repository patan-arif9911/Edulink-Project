package com.edulink.complianceservice.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ComplianceControllerTest {

    @Autowired
    private ComplianceController complianceController;

    @Test
    public void auditRecordsTest(){
        assertNotNull(complianceController.auditRecords());
    }
}
