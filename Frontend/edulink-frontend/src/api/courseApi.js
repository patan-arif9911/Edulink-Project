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

  /* ── Teacher ── */
  fetchTeacherClasses: () =>
    httpClient.get(Endpoints.course.teacherClasses),

  uploadMaterial: (formData) =>
    httpClient.post(Endpoints.course.uploadMaterial, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  fetchTeacherMaterials: (courseCode) =>
    httpClient.get(Endpoints.course.teacherMaterials(courseCode)),

  downloadMaterial: (courseCode, fileId) =>
    httpClient.get(Endpoints.course.downloadMaterial(courseCode, fileId), {
      responseType: "blob",
    }),

  deleteMaterial: (courseCode, materialId) =>
    httpClient.delete(Endpoints.course.deleteMaterial(courseCode, materialId)),

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
