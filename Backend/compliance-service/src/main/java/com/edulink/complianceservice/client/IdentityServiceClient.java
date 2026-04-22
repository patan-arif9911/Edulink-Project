package com.edulink.complianceservice.client;

import com.edulink.complianceservice.dto.IdentityApiResponse;
import com.edulink.complianceservice.dto.SchoolDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "identity-service", url = "${identity.service.url:http://localhost:8081}")
public interface IdentityServiceClient {

    @PostMapping("/compliance/identity/create-school")
    IdentityApiResponse<SchoolDto> createSchool(
            @RequestBody Object request,
            @RequestHeader("Authorization") String authorization);

    @GetMapping("/compliance/identity/schools/{schoolId}")
    IdentityApiResponse<SchoolDto> getSchoolById(
            @PathVariable("schoolId") String schoolId,
            @RequestHeader("Authorization") String authorization);

    @GetMapping("/compliance/identity/schools")
    IdentityApiResponse<java.util.List<SchoolDto>> getAllSchools(
            @RequestHeader("Authorization") String authorization);
}