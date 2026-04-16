package com.edulink.studentservice.config;

import com.edulink.studentservice.entity.*;
import com.edulink.studentservice.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {
    private final EnrollmentRepository enrollmentRepo;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
                // StudentProfile initialization removed. Add Enrollment sample data here if needed.
        };
    }
}
