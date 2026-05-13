const BASE = process.env.REACT_APP_GATEWAY_URL || "http://localhost:9090";;

const Endpoints = {
  /* ═══════════════════════════════════════════════
   *  IDENTITY SERVICE  (Port 8081 behind gateway)
   * ═══════════════════════════════════════════════ */
  identity: {
    // Auth (public)
    login:                          `${BASE}/auth/login`,
    refreshToken:                   `${BASE}/auth/refresh`,
    changePassword:                 `${BASE}/auth/change-password`,
    validateToken:                  `${BASE}/auth/validate`,
    getProfile:                     `${BASE}/auth/profile`,
    updateProfile:                  `${BASE}/auth/update-profile`,

    // Operator endpoints
    createComplianceOfficer:        `${BASE}/operator/create-compliance-officer`,
    createBoardOfficer:             `${BASE}/operator/create-board-officer`,
    createRegulator:                `${BASE}/operator/create-regulator`,
    allUsers:                       `${BASE}/operator/users`,

    // School Admin endpoints
    createTeacher:                  `${BASE}/admin/create-teacher`,
    createStudent:                  `${BASE}/admin/create-student`,
    teachers:                       `${BASE}/admin/teachers`,
    students:                       `${BASE}/admin/students`,
    deleteTeacher:                  (id) => `${BASE}/admin/delete-teacher/${id}`,
    deleteStudent:                  (id) => `${BASE}/admin/delete-student/${id}`,

    // Compliance Officer endpoints
    createSchoolAdmin:              `${BASE}/compliance/identity/create-school-admin`,
    createSchool:                   `${BASE}/compliance/identity/create-school`,
    allSchoolAdmins:                `${BASE}/compliance/identity/school-admins`,
    allSchools:                     `${BASE}/compliance/identity/schools`,

    // Teacher endpoints
    studentsByClass:                `${BASE}/teacher/students-by-class`,
  },

  /* ═══════════════════════════════════════════════
   *  STUDENT SERVICE  (Port 8082 behind gateway)
   * ═══════════════════════════════════════════════ */
  student: {
    // POST /student/profile — public, creates/upserts student profile
    createProfile:                  `${BASE}/student/profile`,
    // GET /student/courses — returns enrolled courses list
    enrolledCourses:                `${BASE}/student/courses`,
    // GET /student/available-courses — returns available/non-enrolled courses list
    availableCourses:               `${BASE}/student/available-courses`,
    // POST /student/enroll — body: { courseCode }
    enrollCourse:                   `${BASE}/student/enroll`,
    // ...existing code...
    materials:           (code) =>  `${BASE}/course/student/materials/${code}`,
    // ...existing code...
    downloadMaterial:    (fileId) => `${BASE}/course/student/materials/download/${fileId}`,
    // ...existing code...
    assignments:         (code) =>  `${BASE}/course/student/assignments/${code}`,
    // ...existing code...
    uploadSubmission:               `${BASE}/student/assignments/upload`,
    // ...existing code...
    uploadSubmissionLegacy:         `${BASE}/student/assignments/upload-legacy`,
    // ...existing code...
    grades:                         `${BASE}/exam/student/grades`,
    // ...existing code...
    attendance:                     `${BASE}/student/attendance`,
    // ...existing code...
    myAssignmentGrades:             `${BASE}/student/my-grades/assignments`,
  },

  /* ═══════════════════════════════════════════════
   *  COURSE SERVICE  (Port 8083 behind gateway)
   * ═══════════════════════════════════════════════ */
  course: {
    // School Admin
    createCourse:                   `${BASE}/course/admin/create-course`,
    createClass:                    `${BASE}/course/admin/create-class`,
    adminClasses:                   `${BASE}/course/admin/classes`,
    adminCourses:                   `${BASE}/course/admin/courses`,
    internalCourses:                `${BASE}/course/internal/courses`,
    attendanceReport:               `${BASE}/admin/attendance-report`,

    // Teacher
    teacherClasses:                 `${BASE}/course/teacher/classes`,
    teacherAllAssignments:          `${BASE}/course/teacher/assignments`,
    teacherCoursesByClass: (classId) => `${BASE}/course/teacher/courses-by-class/${classId}`,
    uploadMaterial:                 `${BASE}/course/teacher/upload-material`,
    teacherMaterials:    (code) =>  `${BASE}/course/teacher/materials/${code}`,
    downloadMaterial:    (fileId) => `${BASE}/course/teacher/materials/download/${fileId}`,
    deleteMaterial:      (id) => `${BASE}/course/teacher/materials/${id}`,
    createAssignment:               `${BASE}/course/teacher/create-assignment`,
    downloadAssignmentQ: (fileId) =>  `${BASE}/course/teacher/assignments/download/${fileId}`,
    teacherCreateExam:              `${BASE}/course/teacher/create-exam`,
    teacherGradeStudent:            `${BASE}/course/teacher/grade-student`,
    teacherClassStudents:(classId)=> `${BASE}/course/teacher/students/${classId}`,

    // Teacher: view student submissions (routed to student-service)
    teacherSubmissions:  (code) =>  `${BASE}/student/teacher-submissions/${code}`,
    teacherDownloadSubmission: (fileId) => `${BASE}/student/teacher-submissions/download/${fileId}`,
    teacherSubmissionById:    (id) => `${BASE}/student/teacher-submission/${id}`,
    teacherGradeAssignmentSubmission: (id) => `${BASE}/student/teacher-submission/${id}/grade`,


    // Student
    studentMaterials:    (code) =>  `${BASE}/course/student/materials/${code}`,
    studentAssignments:  (code) =>  `${BASE}/course/student/assignments/${code}`,
    studentDownloadQ: (num, code) => `${BASE}/course/student/assignments/download-questions/${num}/${code}`,
    studentDownloadMaterial: (code, fileId) => `${BASE}/course/student/materials/download/${fileId}`,
  },

  /* ═══════════════════════════════════════════════
   *  EXAM SERVICE  (Port 8084 behind gateway)
   *  Controller: @RequestMapping("/exam")
   * ═══════════════════════════════════════════════ */
   exam: {
      // Teacher endpoints
      createExam:                     `${BASE}/exam/teacher/create-exam`,
      gradeStudent:                   `${BASE}/exam/teacher/grade-student`,
      examSubmissions:     (courseCode) => `${BASE}/exam/teacher/exam-submissions/${courseCode}`,
      submissionById:      (id) =>    `${BASE}/exam/teacher/submission/${id}`,
      gradesByExam:                   `${BASE}/exam/teacher/grades`,
      gradesByCourse:      (courseCode) => `${BASE}/exam/teacher/grades-by-course/${courseCode}`,
      resetAttempt:                   `${BASE}/exam/teacher/reset-attempt`,
      examsByCourseCode:   (code) =>  `${BASE}/exam/teacher/exams/${code}`,
      teacherAllExams:                `${BASE}/exam/teacher/exams`,
      // Student endpoints
      studentExams:                   `${BASE}/exam/student/exams`,
      studentGrades:                  `${BASE}/exam/student/grades`,
      downloadExamQ:       (examId) => `${BASE}/exam/student/download-exam-questions/${examId}`,
      submitExam:                     `${BASE}/exam/student/submit-exam`,
      startExam:                      `${BASE}/exam/student/start-exam`,
    },

  /* ═══════════════════════════════════════════════
   *  ATTENDANCE SERVICE  (Port 8085 behind gateway)
   * ═══════════════════════════════════════════════ */
  attendance: {
    markAttendance:                 `${BASE}/teacher/mark-attendance`,
    markAttendanceBulk:             `${BASE}/teacher/mark-attendance/bulk`,
    teacherClassAttendance:         `${BASE}/teacher/attendance`,
    studentAttendance:              `${BASE}/student/attendance`,
    adminReport:                    `${BASE}/admin/attendance-report`,
  },

  /* ═══════════════════════════════════════════════
   *  COMPLIANCE SERVICE  (Port 8086 behind gateway)
   * ═══════════════════════════════════════════════ */
  compliance: {
    // Compliance Officer
    auditSchool:                    `${BASE}/compliance/audit-school`,
    complianceStatus:               `${BASE}/compliance/compliance-status`,
    registerSchool:                 `${BASE}/compliance/register-school`,
    auditRecords:                   `${BASE}/compliance/audit-records`,

    // Board Officer
    boardSchools:                   `${BASE}/board/schools`,
    boardAcademicPerformance:       `${BASE}/board/academic-performance`,
    boardReports:                   `${BASE}/board/reports`,
    boardComplianceSummary:         `${BASE}/board/compliance-summary`,

    // Regulator
    regulatorComplianceReports:     `${BASE}/regulator/compliance-reports`,
    regulatorAccreditation:         `${BASE}/regulator/accreditation-status`,
    regulatorSystemAudit:           `${BASE}/regulator/system-audit`,
  },

  /* ═══════════════════════════════════════════════
   *  NOTIFICATION SERVICE  (Port 8087 behind gateway)
   * ═══════════════════════════════════════════════ */
  notification: {
    send:                           `${BASE}/notifications/send`,
    schedule:                       `${BASE}/notifications/schedule`,
    inbox:                          `${BASE}/notifications/my`,
    markRead:            (id) =>    `${BASE}/notifications/${id}/read`,
  },
};

export default Endpoints;
