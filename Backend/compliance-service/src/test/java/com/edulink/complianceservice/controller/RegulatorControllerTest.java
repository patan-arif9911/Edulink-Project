package com.edulink.complianceservice.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class RegulatorControllerTest {

    @Autowired
    private RegulatorController regulatorController;

    @Test
    public void complianceReportTest(){
        assertNotNull(regulatorController.complianceReport());
    }

    @Test
    public void accreditationStatusTest(){
        assertNotNull(regulatorController.accreditationStatus("school1"));
    }

}
