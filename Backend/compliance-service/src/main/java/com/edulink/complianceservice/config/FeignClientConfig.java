package com.edulink.complianceservice.config;

import com.edulink.complianceservice.utils.TokenContext;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignClientConfig {

    private final TokenContext tokenContext;
    @Autowired
    public FeignClientConfig(TokenContext tokenContext) {
        this.tokenContext = tokenContext;
    }

    @Bean
    public RequestInterceptor jwtFeignInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {

                // Fetch token stored by JwtFilter
                String token = tokenContext.getToken();


                if (token != null && !token.isEmpty()) {
                    System.out.println("token = "+token);
                    template.header("Authorization", "Bearer " + token);
                }
            }
        };
    }
}
