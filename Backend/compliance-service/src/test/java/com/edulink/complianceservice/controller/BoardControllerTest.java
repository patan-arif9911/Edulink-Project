package com.edulink.complianceservice.controller;

import com.edulink.complianceservice.dto.PerformanceDto;
import com.edulink.complianceservice.service.BoardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class BoardControllerTest {

    @Autowired
    private BoardController boardController;



    @Test
    public void getSchoolByIdTest(){
        assertNotNull(boardController.getSchoolById("school1"));
    }



    @Test
    public void getPerformanceTest(){
        assertNotNull(boardController.getPerformance());
    }

    @Test
    public void reportTest(){
        assertNotNull(boardController.report("school1"));
    }

}
