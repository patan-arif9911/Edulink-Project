package com.edulink.complianceservice.config;

import com.edulink.complianceservice.exception.CustomAuthenticationException;
import com.edulink.complianceservice.utils.JwtUtil;
import com.edulink.complianceservice.utils.TokenContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final HandlerExceptionResolver handlerExceptionResolver;

    private TokenContext tokenContext;

    @Autowired
    public JwtFilter(JwtUtil jwtUtil, HandlerExceptionResolver handlerExceptionResolver, TokenContext tokenContext) {
        this.jwtUtil = jwtUtil;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.tokenContext=tokenContext;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain filterChain)
            throws ServletException, IOException {


    try {
            String authHead = req.getHeader("Authorization");

            if (authHead == null || !authHead.startsWith("Bearer ")) {
                filterChain.doFilter(req, res);
                return;
            }

            String token = authHead.substring(7);
            tokenContext.setToken(token);
            String username = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

            if (username != null && isValidRole(role)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                        = new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + role)
                ));

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                throw new CustomAuthenticationException("You have not Authorite");
            }


            filterChain.doFilter(req, res);
    }catch (Exception e){
        handlerExceptionResolver.resolveException(req,res,null,e);
    }

    }
    private boolean isValidRole(String role) {
        return role.equals("COMPLIANCE_OFFICER") ||
                role.equals("EDUCATION_BOARD_OFFICER") ||
                role.equals("REGULATOR");
    }
}


