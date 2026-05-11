package com.edulink.identityservice.service;

import com.edulink.identityservice.dto.CreateUserRequest;
import com.edulink.identityservice.dto.UserResponse;
import com.edulink.identityservice.entity.*;
import com.edulink.identityservice.entity.User;
import com.edulink.identityservice.exception.EduLinkException;
import com.edulink.identityservice.repository.*;
import com.edulink.identityservice.util.PasswordGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.*;

import com.edulink.identityservice.repository.*;


import java.util.List;
import java.util.Map;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplianceService {
    private static final Logger log = LoggerFactory.getLogger(ComplianceService.class);
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  PasswordGenerator passwordGenerator;
    @Autowired
    private  StudentRepository studentRepository;
    @Autowired
    private  TeacherRepository teacherRepository;
    @Autowired
    private ComplianceOfficerRepository complianceOfficerRepository;
    @Autowired
    private RegulatorRepository regulatorRepository;
    @Autowired
    private BoardOfficerRepository boardOfficerRepository;
    @Autowired
    private SchoolAdminRepository schoolAdminRepository;

    @Autowired
    private SchoolRepository schoolRepository;



    public Map<String,Integer> getUsers(){
        List<User> user=userRepository.findAll();
        Map<String,Integer> userCar=new HashMap<>();

        for(User u:user){
            String key=u.getRole().toString();
            if(!userCar.containsKey(key)){
                userCar.put(key,1);
            }else{
                int tem=userCar.get(key)+1;
                userCar.put(key,tem);
            }
        }

        return userCar;
    }


    public UserResponse createUser(CreateUserRequest request, String createdByEmail, String authorizationToken) {


        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EduLinkException("Email already registered: " + request.getEmail(), HttpStatus.CONFLICT);
        }

        // Validate schoolId for teachers and students
        if ((request.getRole() == Role.TEACHER || request.getRole() == Role.STUDENT) && request.getSchoolId() == null) {
            throw new IllegalArgumentException("School ID is required for teachers and students");
        }
        if (request.getSchoolId() != null && !schoolRepository.existsById(request.getSchoolId())) {
            throw new IllegalArgumentException("Invalid school ID: " + request.getSchoolId());
        }

        boolean needsTempPassword = (request.getRole() == Role.TEACHER || request.getRole() == Role.STUDENT || request.getRole() == Role.SCHOOL_ADMIN);



        String tempPassword=request.getFullName();
        tempPassword=tempPassword.toUpperCase().charAt(0)+tempPassword.substring(1,4)+request.getDob().substring(0,4);

        String encodedPassword=passwordEncoder.encode(tempPassword);

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .dob(request.getDob())
                .password(encodedPassword)
                .role(request.getRole())
                .active(true)
                .mustChangePassword(needsTempPassword)
                .temporaryPassword(tempPassword)
                .schoolId(request.getSchoolId())
                .classId(request.getClassId())
                .build();

        User saved = userRepository.save(user);
        log.info("User created: {} with role: {} by: {}", saved.getEmail(), saved.getRole(), createdByEmail);

        // Save to role-specific tables
        switch (saved.getRole()) {
            case STUDENT:
                String rollNumber = generateRollNumber(saved.getSchoolId(), saved.getClassId());
                studentRepository.save(new Student(saved.getId(), saved.getEmail(), saved.getFullName(),
                        saved.getSchoolId(), saved.getClassId(), tempPassword, rollNumber));
                log.info("Student profile created for: {} with rollNumber: {}", saved.getEmail(), rollNumber);
                break;
            case TEACHER:
                teacherRepository.save(new Teacher(saved.getId(), saved.getEmail(), saved.getFullName(),
                        saved.getSchoolId(), null, tempPassword));
                log.info("Teacher profile created for: {}", saved.getEmail());
                break;
            case COMPLIANCE_OFFICER:
                complianceOfficerRepository.save(new ComplianceOfficer(saved.getId(), saved.getEmail(),
                        saved.getFullName(), null, tempPassword));
                log.info("Compliance Officer profile created for: {}", saved.getEmail());
                break;
            case SCHOOL_ADMIN:
                schoolAdminRepository.save(new SchoolAdmin(saved.getId(), saved.getEmail(), saved.getFullName(), saved.getSchoolId(), tempPassword));
                log.info("School Admin profile created for: {}", saved.getEmail());
                break;
            case REGULATOR:
                regulatorRepository.save(new Regulator(saved.getId(), saved.getEmail(), saved.getFullName(), null, tempPassword));
                log.info("Regulator profile created for: {}", saved.getEmail());
                break;
            case EDUCATION_BOARD_OFFICER:
                boardOfficerRepository.save(new BoardOfficer(saved.getId(), saved.getEmail(),
                        saved.getFullName(), null, tempPassword));
                log.info("Board Officer profile created for: {}", saved.getEmail());
                break;
            default:
                log.debug("No role-specific table for role: {}", saved.getRole());
        }

        return mapToResponse(saved);
    }


    private String generateRollNumber(String schoolId, Long classId) {
        String prefix = schoolId + classId;
        List<Student> existing = studentRepository.findBySchoolIdAndClassId(schoolId, classId);
        int nextRoll = existing.stream()
                .map(Student::getRollNumber)
                .filter(r -> r != null && r.startsWith(prefix))
                .mapToInt(r -> {
                    try { return Integer.parseInt(r.substring(prefix.length())); }
                    catch (Exception e) { return 0; }
                })
                .max().orElse(0) + 1;
        return String.format("%s%02d", prefix, nextRoll);
    }

    private UserResponse mapToResponse(User user) {
        String rollNumber = null;
        if (user.getRole() == Role.STUDENT) {
            rollNumber = studentRepository.findByUserId(user.getId())
                    .map(s -> s.getRollNumber())
                    .orElse(null);
        }
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
}
