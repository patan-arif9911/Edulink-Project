import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const attendanceApi = {
  /* ── Teacher ── */
  markAttendance: (payload) =>
    httpClient.post(Endpoints.attendance.markAttendance, payload),

  /* ── Student ── */
  fetchStudentAttendance: () =>
    httpClient.get(Endpoints.attendance.studentAttendance),

  /* ── School Admin ── */
  fetchAdminReport: (params) =>
    httpClient.get(Endpoints.attendance.adminReport, { params }),
};

export default attendanceApi;
