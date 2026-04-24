package com.edulink.courseservice.client;

import com.edulink.courseservice.dto.ApiResponse;
import com.edulink.courseservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "identity-service", url = "${identity.service.url:http://localhost:8081}")
public interface IdentityClient {

    @GetMapping("/auth/user-by-email")
    UserDto getUserByEmail(@RequestParam("email") String email);

    @GetMapping("/teacher/students-by-class")
    ApiResponse<List<UserDto>> getStudentsByClassAndSchool(
            @RequestParam("classId") Long classId,
            @RequestParam("schoolId") String schoolId,
            @RequestHeader("Authorization") String authorization);

    @GetMapping("/compliance/identity/schools/{schoolId}")
    ApiResponse<Object> getSchoolById(@PathVariable("schoolId") String schoolId);
}