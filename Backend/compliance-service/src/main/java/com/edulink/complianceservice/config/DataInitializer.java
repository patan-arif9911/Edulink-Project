package com.edulink.complianceservice.config;
import com.edulink.complianceservice.entity.ComplianceRecord;
import com.edulink.complianceservice.repository.ComplianceRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private final ComplianceRecordRepository repo;

    public DataInitializer(ComplianceRecordRepository repo) {
        this.repo = repo;
    }

    @Bean
    public CommandLineRunner init() {
        return args -> {
            log.info("Initializing compliance service data...");

            if (repo.count() == 0) {
                // Sample compliance records will be created as needed
                log.info("No compliance records to initialize");
            }

            log.info("Compliance service data initialization completed");
        };
    }
}
