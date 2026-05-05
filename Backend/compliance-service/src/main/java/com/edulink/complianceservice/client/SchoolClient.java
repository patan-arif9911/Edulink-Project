package com.edulink.complianceservice.client;


import com.edulink.complianceservice.config.FeignClientConfig;
import com.edulink.complianceservice.dto.ApiResponse;
import com.edulink.complianceservice.dto.SchoolDto;

import com.edulink.complianceservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//url="http://localhost:8081",configuration = FeignClientConfig.class
@FeignClient(name="IDENTITY-SERVICE")
public interface SchoolClient {


    @GetMapping("/compliance/identity/usersStatus")
    public ResponseEntity<Map<String,Integer>> getUsers();



    @PostMapping("/compliance/identity/create-school-admin")
    public ResponseEntity<ApiResponse<UserDto>> createSchoolAdmin(@RequestHeader("Authorization") String token, @RequestBody UserDto userDto);

    @GetMapping("/compliance/identity/schools")
    public ResponseEntity<ApiResponse<List<SchoolDto>>> getAllSchools() ;

    @PostMapping({"/compliance/identity/create-school"})
    public ResponseEntity<ApiResponse<SchoolDto>> createSchool( @RequestBody  SchoolDto schoolDto);

//    GetMapping()
}
