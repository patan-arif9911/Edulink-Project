import httpClient from "./httpClient";
import Endpoints from "../config/endpoints";

const complianceApi = {
  /* ── Compliance Officer ── */
  auditSchool: (payload) =>
    httpClient.post(Endpoints.compliance.auditSchool, payload),

  fetchComplianceStatus: () =>
    httpClient.get(Endpoints.compliance.complianceStatus),

  registerSchool: (payload) =>
    httpClient.post(Endpoints.compliance.registerSchool, payload),

  fetchAuditRecords: () =>
    httpClient.get(Endpoints.compliance.auditRecords),

  /* ── Education Board Officer ── */
  fetchBoardSchools: () =>
    httpClient.get(Endpoints.compliance.boardSchools),

  fetchAcademicPerformance: (params) =>
    httpClient.get(Endpoints.compliance.boardAcademicPerformance, { params }),

  fetchBoardReports: () =>
    httpClient.get(Endpoints.compliance.boardReports),

  fetchComplianceSummary: () =>
    httpClient.get(Endpoints.compliance.boardComplianceSummary),

  /* ── Regulator ── */
  fetchRegulatorComplianceReports: () =>
    httpClient.get(Endpoints.compliance.regulatorComplianceReports),

  fetchAccreditationStatus: () =>
    httpClient.get(Endpoints.compliance.regulatorAccreditation),

  fetchSystemAudit: () =>
    httpClient.get(Endpoints.compliance.regulatorSystemAudit),
};

export default complianceApi;
