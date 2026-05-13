package com.edulink.identityservice.service;

import com.edulink.identityservice.dto.*;
import com.edulink.identityservice.entity.*;
import com.edulink.identityservice.exception.EduLinkException;
import com.edulink.identityservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    private static final Logger log = LoggerFactory.getLogger(UserManagementService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ComplianceOfficerRepository complianceOfficerRepository;
    private final RegulatorRepository regulatorRepository;
    private final BoardOfficerRepository boardOfficerRepository;
    private final SchoolAdminRepository schoolAdminRepository;
    private final SchoolRepository schoolRepository;

    public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                StudentRepository studentRepository,
                                TeacherRepository teacherRepository, ComplianceOfficerRepository complianceOfficerRepository,
                                RegulatorRepository regulatorRepository, BoardOfficerRepository boardOfficerRepository,
                                SchoolAdminRepository schoolAdminRepository, SchoolRepository schoolRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.complianceOfficerRepository = complianceOfficerRepository;
        this.regulatorRepository = regulatorRepository;
        this.boardOfficerRepository = boardOfficerRepository;
        this.schoolAdminRepository = schoolAdminRepository;
        this.schoolRepository = schoolRepository;
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

        String tempPassword = request.getFullName();
        String tem = tempPassword.toUpperCase().charAt(0) + "";

            for (int i = 1; i < 4; i++) {
                if (tempPassword.length()<=i || tempPassword.charAt(i) == ' ') {
                    tem = tem + "x";
                } else {
                    tem = tem + (tempPassword.toLowerCase().charAt(i));
                }
            }

            tempPassword = tem + "@" + request.getDob().substring(0, 4);
        String encodedPassword = passwordEncoder.encode(tempPassword);



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


    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    public void deleteUser(String userId, Role expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EduLinkException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        if (user.getRole() != expectedRole) {
            throw new EduLinkException("User is not a " + expectedRole.name(), HttpStatus.BAD_REQUEST);
        }

        // Delete from role-specific table first
        switch (user.getRole()) {
            case STUDENT:
                studentRepository.findByUserId(userId).ifPresent(studentRepository::delete);
                break;
            case TEACHER:
                teacherRepository.findByUserId(userId).ifPresent(teacherRepository::delete);
                break;
            case COMPLIANCE_OFFICER:
                complianceOfficerRepository.findById(Long.valueOf(userId)).ifPresent(complianceOfficerRepository::delete);
                break;
            case SCHOOL_ADMIN:
                schoolAdminRepository.findById(Long.valueOf(userId)).ifPresent(schoolAdminRepository::delete);
                break;
            case REGULATOR:
                regulatorRepository.findById(Long.valueOf(userId)).ifPresent(regulatorRepository::delete);
                break;
            case EDUCATION_BOARD_OFFICER:
                boardOfficerRepository.findById(Long.valueOf(userId)).ifPresent(boardOfficerRepository::delete);
                break;
            default:
                break;
        }

        // Delete from user table
        userRepository.delete(user);
        log.info("User deleted: {} with role: {}", user.getEmail(), user.getRole());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EduLinkException("User not found", HttpStatus.NOT_FOUND));
        return mapToResponse(user);
    }

    public School createSchool(SchoolCreateRequest request, String createdByEmail) {
        if (schoolRepository.existsById(request.getId())) {
            throw new EduLinkException("School with ID " + request.getId() + " already exists", HttpStatus.CONFLICT);
        }
        School school = new School();
        school.setId(request.getId());
        school.setName(request.getName());
        school.setAddress(request.getAddress());
        school.setPhone(request.getPhone());
        school.setEmail(request.getEmail());
        school.setTeacherNumber(request.getTeacherNumber());
        school.setStudentNumber(request.getStudentNumber());
        school.setPrincipalName(request.getPrincipalName());
        school.setEstablishedDate(request.getEstablishedDate());
        School saved = schoolRepository.save(school);
        log.info("School created: {} by: {}", saved.getName(), createdByEmail);
        return saved;
    }

    public School getSchoolById(String schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> new EduLinkException("School not found with ID " + schoolId, HttpStatus.NOT_FOUND));
    }

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
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

    /**
     * Generates the next roll number for a student.
     * Format: {schoolId}{classId}{2-digit roll}
     * Example: SCH001 + class 1 + roll 02 => SCH001102
     */
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
}
