import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const attendanceApi = {
  /* ── Teacher ── */
  markAttendance: (payload) =>
    httpClient.post(Endpoints.attendance.markAttendance, payload),

  /** Save Present/Absent/OD for an entire class on a given date in one request. */
  markAttendanceBulk: (payload) =>
    httpClient.post(Endpoints.attendance.markAttendanceBulk, payload),

  /** Fetch existing attendance for a class+date so the marking table can pre-fill. */
  fetchClassAttendance: ({ courseId, date }) =>
    httpClient.get(Endpoints.attendance.teacherClassAttendance, {
      params: { courseId, date },
    }),

  /* ── Student ── */
  fetchStudentAttendance: () =>
    httpClient.get(Endpoints.attendance.studentAttendance),

  /* ── School Admin ── */
  fetchAdminReport: (params) =>
    httpClient.get(Endpoints.attendance.adminReport, { params }),
};

export default attendanceApi;
