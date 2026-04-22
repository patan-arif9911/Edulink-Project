package com.edulink.courseservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.edulink.courseservice.repository.LearningMaterialRepository;
@SpringBootApplication
@EnableFeignClients
@EnableJpaRepositories(
        basePackages = "com.edulink.courseservice.repository",
        excludeFilters = @Filter(type = FilterType.ASSIGNABLE_TYPE, classes = LearningMaterialRepository.class)
)
@EnableMongoRepositories(basePackageClasses = LearningMaterialRepository.class)
public class CourseServiceApplication {
    public static void main(String[] args) { SpringApplication.run(CourseServiceApplication.class, args); }
}



