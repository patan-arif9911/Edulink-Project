package com.edulink.studentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

@FeignClient(name = "identity-service", url = "${identity.service.url:http://localhost:8081}")
public interface IdentityServiceClient {
    @GetMapping("/auth/user-by-email")
    Map<String, Object> getUserByEmail(@RequestParam("email") String email, @RequestHeader("Authorization") String authorization);
}
