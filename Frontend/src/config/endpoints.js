const BASE = "";

const Endpoints = {
  /* ═══════════════════════════════════════════════
   *  IDENTITY SERVICE  (Port 8081 behind gateway)
   * ═══════════════════════════════════════════════ */
  identity: {
    // Auth (public)
    login:                          `${BASE}/auth/login`,
    changePassword:                 `${BASE}/auth/change-password`,
    validateToken:                  `${BASE}/auth/validate`,

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
    // POST /student/enroll — body: { courseCode }
    enrollCourse:                   `${BASE}/student/enroll`,
    // GET /student/materials/{courseCode} — proxied from course-service
    materials:           (code) =>  `${BASE}/course/student/materials/${code}`,
    // GET /student/materials/download/{fileId} — binary file download
    downloadMaterial:    (fileId) => `${BASE}/student/materials/download/${fileId}`,
    // GET /student/assignments/{courseCode} — proxied from course-service
    assignments:         (code) =>  `${BASE}/course/student/assignments/${code}`,
    // POST /student/assignments/upload — multipart form
    uploadSubmission:               `${BASE}/student/assignments/upload`,
    // POST /student/assignments/upload-legacy — JSON body
    uploadSubmissionLegacy:         `${BASE}/student/assignments/upload-legacy`,
    // GET /student/grades — returns grades from exam-service
    grades:                         `${BASE}/exam/student/grades`,
    // GET /student/attendance — returns attendance from attendance-service
    attendance:                     `${BASE}/student/attendance`,
  },

  /* ═══════════════════════════════════════════════
   *  COURSE SERVICE  (Port 8083 behind gateway)
   * ═══════════════════════════════════════════════ */
  course: {
    // School Admin
    createCourse:                   `${BASE}/course/admin/create-course`,
    createClass:                    `${BASE}/course/admin/create-class`,
    attendanceReport:               `${BASE}/course/admin/attendance-report`,

    // Teacher
    teacherClasses:                 `${BASE}/course/teacher/classes`,
    uploadMaterial:                 `${BASE}/course/teacher/upload-material`,
    teacherMaterials:    (code) =>  `${BASE}/course/teacher/materials/${code}`,
    downloadMaterial:    (code, fileId) => `${BASE}/course/teacher/materials/download/${fileId}`,
    deleteMaterial:      (code, id) => `${BASE}/course/teacher/materials/${id}`,
    createAssignment:               `${BASE}/course/teacher/create-assignment`,
    downloadAssignmentQ: (fileId) =>  `${BASE}/course/teacher/assignments/download/${fileId}`,
    teacherCreateExam:              `${BASE}/course/teacher/create-exam`,
    teacherGradeStudent:            `${BASE}/course/teacher/grade-student`,
    teacherClassStudents:(classId)=> `${BASE}/course/teacher/students/${classId}`,

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
    examSubmissions:     (examId) => `${BASE}/exam/teacher/exam-submissions/${examId}`,
    // Student endpoints
    studentExams:                   `${BASE}/exam/student/exams`,
    studentGrades:                  `${BASE}/exam/student/grades`,
    downloadExamQ:       (examId) => `${BASE}/exam/student/download-exam-questions/${examId}`,
    submitExam:                     `${BASE}/exam/student/submit-exam`,
  },

  /* ═══════════════════════════════════════════════
   *  ATTENDANCE SERVICE  (Port 8085 behind gateway)
   * ═══════════════════════════════════════════════ */
  attendance: {
    markAttendance:                 `${BASE}/attendance/teacher/mark-attendance`,
    studentAttendance:              `${BASE}/attendance/student/attendance`,
    adminReport:                    `${BASE}/attendance/admin/attendance-report`,
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
