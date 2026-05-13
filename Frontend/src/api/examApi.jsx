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

  /* GET /exam/teacher/exam-submissions/{courseCode} — all submissions for a course (caller filters by examType) */
  fetchExamSubmissions: (courseCode) =>
    httpClient.get(Endpoints.exam.examSubmissions(courseCode)),

  /* GET /exam/teacher/submission/{id} — single submission with content for the evaluate page */
  fetchSubmissionById: (id) =>
    httpClient.get(Endpoints.exam.submissionById(id)),

  /* GET /exam/teacher/grades?courseCode=&examType= — used to mark "Graded" rows on the roster */
  fetchGradesByExam: ({ courseCode, examType }) =>
    httpClient.get(Endpoints.exam.gradesByExam, { params: { courseCode, examType } }),

  /* GET /exam/teacher/grades-by-course/{courseCode} — every grade for a course */
  fetchGradesByCourse: (courseCode) =>
    httpClient.get(Endpoints.exam.gradesByCourse(courseCode)),

  /* DELETE /exam/teacher/reset-attempt — wipe a student's submission so they can retake */
  resetAttempt: ({ courseCode, examType, rollNumber }) =>
    httpClient.delete(Endpoints.exam.resetAttempt, {
      params: { courseCode, examType, rollNumber },
    }),

  /* GET /exam/teacher/exams/{courseCode} - Get exams by course code */
  fetchExamsByCourseCode: (courseCode) =>
    httpClient.get(Endpoints.exam.examsByCourseCode(courseCode)),

  /* GET /exam/teacher/exams — every exam the teacher has created */
  fetchTeacherExams: () =>
    httpClient.get(Endpoints.exam.teacherAllExams),

  /* ── Student endpoints ── */

  /* GET /exam/student/exams?courseCodes=CODE1&courseCodes=CODE2
     Returns list of Exam objects for the given course codes */
  fetchStudentExams: (courseCodes) =>
    httpClient.get(Endpoints.exam.studentExams, {
      params: { courseCodes },
      paramsSerializer: { indexes: null },
    }),

  /* GET /exam/student/grades — rollNumber extracted from JWT by backend */
  fetchStudentGrades: () =>
    httpClient.get(Endpoints.exam.studentGrades),

  /* GET /exam/student/exams/{examId}/download-questions → binary */
  downloadExamQuestions: (examId) =>
    httpClient.get(Endpoints.exam.downloadExamQ(examId), {
      responseType: "blob",
    }),

  /* POST /exam/student/start-exam — JSON body: { examId, courseCode, examType }
     Creates or returns the in-progress submission row carrying startedAt. */
  startExam: ({ examId, courseCode, examType }) =>
    httpClient.post(Endpoints.exam.startExam, { examId, courseCode, examType }),

  /* POST /exam/student/submit-exam — JSON body:
     { examId, courseCode, examType, submissionContent } */
  submitExam: (payload) =>
    httpClient.post(Endpoints.exam.submitExam, payload),
};

export default examApi;
