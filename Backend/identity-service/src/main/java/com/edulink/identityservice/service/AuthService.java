package com.edulink.identityservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edulink.identityservice.dto.ApiResponse;
import com.edulink.identityservice.dto.ChangePasswordRequest;
import com.edulink.identityservice.dto.LoginRequest;
import com.edulink.identityservice.dto.LoginResponse;
import com.edulink.identityservice.dto.UpdateProfileRequest;
import com.edulink.identityservice.dto.UserResponse;
import com.edulink.identityservice.entity.User;
import com.edulink.identityservice.exception.BadRequestException;
import com.edulink.identityservice.exception.EduLinkException;
import com.edulink.identityservice.exception.InvalidCredentialsException;
import com.edulink.identityservice.exception.UserNotFoundException;
import com.edulink.identityservice.repository.UserRepository;
import com.edulink.identityservice.repository.StudentRepository;
import com.edulink.identityservice.util.JwtUtil;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StudentRepository studentRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.studentRepository = studentRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new EduLinkException("Account is deactivated", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String rollNumber = null;
        if (user.getRole() == com.edulink.identityservice.entity.Role.STUDENT) {
            rollNumber = studentRepository.findByUserId(user.getId())
                    .map(s -> s.getRollNumber())
                    .orElse(null);
        }
        String accessToken;
        if (rollNumber != null) {
            accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId(), "rollNumber", rollNumber);
        } else if (user.getSchoolId() != null) {
            accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId(), "schoolId", user.getSchoolId());
        } else {
            accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        }
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        log.info("User logged in: {} with role: {}", user.getEmail(), user.getRole());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .role(user.getRole().name())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userId(user.getId())
                .schoolId(user.getSchoolId())
                .mustChangePassword(user.isMustChangePassword())
                .build();
    }

    public ApiResponse<String> changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        user.setTemporaryPassword(null);
        userRepository.save(user);

        return ApiResponse.success("Password changed successfully", null);
    }

    public LoginResponse refreshToken(String refreshToken) {
        try {
            String email = jwtUtil.extractEmail(refreshToken);
            if (jwtUtil.isTokenExpired(refreshToken)) {
                throw new InvalidCredentialsException("Refresh token expired");
            }
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            String rollNumber = null;
            if (user.getRole() == com.edulink.identityservice.entity.Role.STUDENT) {
                rollNumber = studentRepository.findByUserId(user.getId())
                        .map(s -> s.getRollNumber())
                        .orElse(null);
            }
            String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId(), rollNumber, user.getSchoolId());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .role(user.getRole().name())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .userId(user.getId())
                    .schoolId(user.getSchoolId())
                    .mustChangePassword(user.isMustChangePassword())
                    .build();
        } catch (EduLinkException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid refresh token");
        }
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        String rollNumber = studentRepository.findByUserId(String.valueOf(user.getId()))
                .map(s -> s.getRollNumber())
                .orElse(null);
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.isActive())
                .mustChangePassword(user.isMustChangePassword())
                .temporaryPassword(user.isMustChangePassword() ? user.getTemporaryPassword() : null)
                .schoolId(user.getSchoolId())
                .classId(user.getClassId())
                .rollNumber(rollNumber)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setFullName(request.getFullName());
        userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.isActive())
                .schoolId(user.getSchoolId())
                .classId(user.getClassId())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
