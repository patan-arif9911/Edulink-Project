package com.edulink.courseservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "student-service", url = "${student.service.url:http://localhost:8082}")
public interface StudentServiceClient {

    @GetMapping("/student/submissions/{assignmentId}")
    Object getAssignmentSubmissions(
            @PathVariable("assignmentId") Long assignmentId,
            @RequestHeader("Authorization") String authorization);
}
