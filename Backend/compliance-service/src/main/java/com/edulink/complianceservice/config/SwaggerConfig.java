package com.edulink.complianceservice.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {


    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("compliance Service")
                        .description("This service for Compliance Officer")
                        .contact(new Contact()
                                .name("Aditya Kiran")
                                .email("2479791@Cognizant.com"))
                );
    }

}
