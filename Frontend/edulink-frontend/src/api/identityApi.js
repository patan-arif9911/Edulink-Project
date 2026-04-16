import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const identityApi = {
  /* ── Auth (Public) ── */
  login: (payload) =>
    httpClient.post(Endpoints.identity.login, payload),

  changePassword: (payload) =>
    httpClient.post(Endpoints.identity.changePassword, payload),

  validateToken: () =>
    httpClient.get(Endpoints.identity.validateToken),

  /* ── Operator Actions ── */
  createComplianceOfficer: (payload) =>
    httpClient.post(Endpoints.identity.createComplianceOfficer, payload),

  createBoardOfficer: (payload) =>
    httpClient.post(Endpoints.identity.createBoardOfficer, payload),

  createRegulator: (payload) =>
    httpClient.post(Endpoints.identity.createRegulator, payload),

  fetchAllUsers: () =>
    httpClient.get(Endpoints.identity.allUsers),

  /* ── School Admin Actions ── */
  createTeacher: (payload) =>
    httpClient.post(Endpoints.identity.createTeacher, payload),

  createStudent: (payload) =>
    httpClient.post(Endpoints.identity.createStudent, payload),

  fetchTeachers: () =>
    httpClient.get(Endpoints.identity.teachers),

  fetchStudents: () =>
    httpClient.get(Endpoints.identity.students),

  /* ── Compliance Officer Actions ── */
  createSchoolAdmin: (payload) =>
    httpClient.post(Endpoints.identity.createSchoolAdmin, payload),

  createSchool: (payload) =>
    httpClient.post(Endpoints.identity.createSchool, payload),

  fetchAllSchoolAdmins: () =>
    httpClient.get(Endpoints.identity.allSchoolAdmins),

  fetchAllSchools: () =>
    httpClient.get(Endpoints.identity.allSchools),

  /* ── Teacher Actions ── */
  fetchStudentsByClass: (params) =>
    httpClient.get(Endpoints.identity.studentsByClass, { params }),
};

export default identityApi;
