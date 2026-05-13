import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const courseApi = {
  /* ── School Admin ── */
  createCourse: (payload) =>
    httpClient.post(Endpoints.course.createCourse, payload),

  createClass: (payload) =>
    httpClient.post(Endpoints.course.createClass, payload),

  fetchAttendanceReport: (params) =>
    httpClient.get(Endpoints.course.attendanceReport, { params }),

  fetchAdminClasses: () =>
    httpClient.get(Endpoints.course.adminClasses),

  fetchAdminCourses: () =>
    httpClient.get(Endpoints.course.adminCourses),

  /* ── Teacher ── */
  fetchTeacherClasses: () =>
    httpClient.get(Endpoints.course.teacherClasses),

  /* GET /course/teacher/assignments — every assignment the teacher has created */
  fetchTeacherAssignments: () =>
    httpClient.get(Endpoints.course.teacherAllAssignments),

  /* GET /course/teacher/courses-by-class/{classId} — courses offered in the chosen class */
  fetchCoursesByClass: (classId) =>
    httpClient.get(Endpoints.course.teacherCoursesByClass(classId)),

  uploadMaterial: (formData) =>
    httpClient.post(Endpoints.course.uploadMaterial, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  fetchTeacherMaterials: (courseCode) =>
    httpClient.get(Endpoints.course.teacherMaterials(courseCode)),

  downloadMaterial: (courseCode, fileId) =>
    httpClient.get(Endpoints.course.downloadMaterial(fileId), {
      responseType: "blob",
    }),

  deleteMaterial: (courseCode, materialId) =>
    httpClient.delete(Endpoints.course.deleteMaterial(materialId)),

  createAssignment: (formData) =>
    httpClient.post(Endpoints.course.createAssignment, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  downloadAssignmentQuestions: (courseCode) =>
    httpClient.get(Endpoints.course.downloadAssignmentQ(courseCode), {
      responseType: "blob",
    }),

  fetchClassStudents: (classId) =>
    httpClient.get(Endpoints.course.teacherClassStudents(classId)),

  /* ── Teacher: Student Submissions ── */
  fetchSubmissions: (courseCode) =>
    httpClient.get(Endpoints.course.teacherSubmissions(courseCode)),

  downloadSubmission: (fileId) =>
    httpClient.get(Endpoints.course.teacherDownloadSubmission(fileId), {
      responseType: "blob",
    }),

  /* GET /student/teacher-submission/{id} — single assignment submission for the Evaluate page */
  fetchAssignmentSubmissionById: (id) =>
    httpClient.get(Endpoints.course.teacherSubmissionById(id)),

  /* POST /student/teacher-submission/{id}/grade — body: { marksObtained, maxMarks, remarks } */
  gradeAssignmentSubmission: (id, payload) =>
    httpClient.post(Endpoints.course.teacherGradeAssignmentSubmission(id), payload),

  /* ── Student ── */
  fetchStudentMaterials: (courseCode) =>
    httpClient.get(Endpoints.course.studentMaterials(courseCode)),

  fetchStudentAssignments: (courseCode) =>
    httpClient.get(Endpoints.course.studentAssignments(courseCode)),

  downloadStudentQuestions: (assignmentNum, courseCode) =>
    httpClient.get(Endpoints.course.studentDownloadQ(assignmentNum, courseCode), {
      responseType: "blob",
    }),

  downloadStudentMaterial: (courseCode, fileId) =>
    httpClient.get(Endpoints.course.studentDownloadMaterial(courseCode, fileId), {
      responseType: "blob",
    }),
};

export default courseApi;
