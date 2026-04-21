import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const examApi = {
  /* ── Teacher endpoints ── */

  /* POST /exam/create — multipart/form-data
     Fields: courseCode, teacherEmail, examTitle, totalMarks,
             passingMarks, schoolId, examDate, questionsFile? */
  createExam: (formData) =>
    httpClient.post(Endpoints.exam.createExam, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /* POST /exam/grade — JSON body: { examId, studentId, teacherEmail,
     marksObtained, totalMarks, grade, remarks } */
  gradeStudent: (payload) =>
    httpClient.post(Endpoints.exam.gradeStudent, payload),

  /* GET /exam/submissions/{examId} */
  fetchExamSubmissions: (examId) =>
    httpClient.get(Endpoints.exam.examSubmissions(examId)),

  /* ── Student endpoints ── */

  /* GET /exam/student/exams?courseCodes=CODE1&courseCodes=CODE2
     Returns list of Exam objects for the given course codes */
  fetchStudentExams: (courseCodes) =>
    httpClient.get(Endpoints.exam.studentExams, {
      params: { courseCodes },
      paramsSerializer: { indexes: null },
    }),

  /* GET /exam/student/grades?studentId=X */
  fetchStudentGrades: (studentId) =>
    httpClient.get(Endpoints.exam.studentGrades, {
      params: { studentId },
    }),

  /* GET /exam/student/exams/{examId}/download-questions → binary */
  downloadExamQuestions: (examId) =>
    httpClient.get(Endpoints.exam.downloadExamQ(examId), {
      responseType: "blob",
    }),

  /* POST /exam/student/submit — JSON body:
     { examId, studentEmail, submissionContent } */
  submitExam: (payload) =>
    httpClient.post(Endpoints.exam.submitExam, payload),
};

export default examApi;
