//package com.edulink.complianceservice.utils;
//
//import feign.RequestInterceptor;
//import feign.RequestTemplate;
//import org.springframework.stereotype.Component;
//
//@Component
//public class FeignClientInterceptor implements RequestInterceptor {
//
//    @Override
//    public void apply(RequestTemplate template) {
//        String token = TokenContext.getToken(); // You store current request token
//        if (token != null) {
//            template.header("Authorization", "Bearer " + token);
//        }
//    }
//
//}
