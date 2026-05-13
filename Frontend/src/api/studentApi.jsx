import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const studentApi = {
  /* ── GET /student/courses ── */
  fetchEnrolledCourses: () =>
    httpClient.get(Endpoints.student.enrolledCourses),

  /* ── GET /student/available-courses ── */
  fetchAvailableCourses: () =>
    httpClient.get(Endpoints.student.availableCourses),

  /* ── POST /student/enroll  body: { courseCode } ── */
  enrollCourse: (courseCode) =>
    httpClient.post(Endpoints.student.enrollCourse, { courseCode }),

  /* ── GET /student/materials/{courseCode} ── */
  fetchMaterials: (courseCode) =>
    httpClient.get(Endpoints.student.materials(courseCode)),

  /* ── GET /student/materials/download/{fileId} → binary ── */
  downloadMaterial: (fileId) =>
    httpClient.get(Endpoints.student.downloadMaterial(fileId), {
      responseType: "blob",
    }),

  /* ── GET /student/assignments/{courseCode} ── */
  fetchAssignments: (courseCode) =>
    httpClient.get(Endpoints.student.assignments(courseCode)),

  /* ── POST /student/assignments/upload → multipart/form-data ──
       Fields: assignmentNum (int), courseCode (str), assignmentTitle (str),
               submissionContent? (str), file? (File)                      */
  uploadSubmission: (formData) =>
    httpClient.post(Endpoints.student.uploadSubmission, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /* ── POST /student/assignments/upload-legacy → JSON ──
       Body: { assignmentNum, courseCode, assignmentTitle,
               submissionContent?, fileUrl? }                */
  uploadSubmissionLegacy: (payload) =>
    httpClient.post(Endpoints.student.uploadSubmissionLegacy, payload),

  /* ── GET /exam/student/grades — exam grades from exam-service ── */
  fetchGrades: () =>
    httpClient.get(Endpoints.exam.studentGrades),

  /* ── GET /student/my-grades/assignments — assignment grades from student-service ── */
  fetchAssignmentGrades: () =>
    httpClient.get(Endpoints.student.myAssignmentGrades),

  /* ── GET /student/attendance — via attendance-service gateway route ── */
  fetchAttendance: () =>
    httpClient.get(Endpoints.attendance.studentAttendance),

  /* ── POST /student/profile (public, no auth needed) ── */
  createProfile: (payload) =>
    httpClient.post(Endpoints.student.createProfile, payload),
};

export default studentApi;
