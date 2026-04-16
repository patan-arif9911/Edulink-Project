import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { EduLinkRoles } from "../config/roles";

import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";
import PasswordChangeGuard from "../guards/PasswordChangeGuard";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// ── Auth ──
import LoginPage from "../pages/auth/LoginPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import ForbiddenPage from "../pages/auth/ForbiddenPage";

// ── Operator ──
import OperatorDashboard from "../pages/operator/OperatorDashboard";
import ManageUsersPage from "../pages/operator/ManageUsersPage";
import AddComplianceOfficerPage from "../pages/operator/AddComplianceOfficerPage";
import AddBoardOfficerPage from "../pages/operator/AddBoardOfficerPage";
import AddRegulatorPage from "../pages/operator/AddRegulatorPage";

// ── Compliance ──
import ComplianceDashboard from "../pages/compliance/ComplianceDashboard";
import RegisterSchoolPage from "../pages/compliance/RegisterSchoolPage";
import AddSchoolAdminPage from "../pages/compliance/AddSchoolAdminPage";
import PerformAuditPage from "../pages/compliance/PerformAuditPage";
import ViewComplianceStatusPage from "../pages/compliance/ViewComplianceStatusPage";
import ViewAuditRecordsPage from "../pages/compliance/ViewAuditRecordsPage";

// ── Board ──
import BoardDashboard from "../pages/board/BoardDashboard";
import RegisteredSchoolsPage from "../pages/board/RegisteredSchoolsPage";
import AcademicPerformancePage from "../pages/board/AcademicPerformancePage";
import BoardReportsPage from "../pages/board/BoardReportsPage";
import ComplianceSummaryPage from "../pages/board/ComplianceSummaryPage";

// ── Regulator ──
import RegulatorDashboard from "../pages/regulator/RegulatorDashboard";
import ComplianceReportsPage from "../pages/regulator/ComplianceReportsPage";
import AccreditationPage from "../pages/regulator/AccreditationPage";
import SystemAuditPage from "../pages/regulator/SystemAuditPage";
import RegulatorAuditRecordsPage from "../pages/regulator/RegulatorAuditRecordsPage";

// ── School Admin ──
import SchoolAdminDashboard from "../pages/schoolAdmin/SchoolAdminDashboard";
import AddTeacherPage from "../pages/schoolAdmin/AddTeacherPage";
import AddStudentPage from "../pages/schoolAdmin/AddStudentPage";
import ViewTeachersPage from "../pages/schoolAdmin/ViewTeachersPage";
import ViewStudentsPage from "../pages/schoolAdmin/ViewStudentsPage";
import AddCoursePage from "../pages/schoolAdmin/AddCoursePage";
import AddClassPage from "../pages/schoolAdmin/AddClassPage";
import AttendanceReportPage from "../pages/schoolAdmin/AttendanceReportPage";

// ── Teacher ──
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyClassesPage from "../pages/teacher/MyClassesPage";
import ClassRosterPage from "../pages/teacher/ClassRosterPage";
import UploadMaterialPage from "../pages/teacher/UploadMaterialPage";
import NewAssignmentPage from "../pages/teacher/NewAssignmentPage";
import NewExamPage from "../pages/teacher/NewExamPage";
import GradeStudentPage from "../pages/teacher/GradeStudentPage";
import RecordAttendancePage from "../pages/teacher/RecordAttendancePage";

// ── Student ──
import StudentDashboard from "../pages/student/StudentDashboard";
import EnrolledCoursesPage from "../pages/student/EnrolledCoursesPage";
import CourseMaterialsPage from "../pages/student/CourseMaterialsPage";
import CourseAssignmentsPage from "../pages/student/CourseAssignmentsPage";
import StudentExamsPage from "../pages/student/StudentExamsPage";
import SubmitAssignmentPage from "../pages/student/SubmitAssignmentPage";
import ViewGradesPage from "../pages/student/ViewGradesPage";
import ViewAttendancePage from "../pages/student/ViewAttendancePage";

// ── Notifications ──
import InboxPage from "../pages/notifications/InboxPage";
import ComposeNotificationPage from "../pages/notifications/ComposeNotificationPage";

// ── Shared ──
import PageNotFound from "../pages/shared/PageNotFound";

const {
  OPERATOR,
  COMPLIANCE_OFFICER,
  EDUCATION_BOARD_OFFICER,
  REGULATOR,
  SCHOOL_ADMIN,
  TEACHER,
  STUDENT,
} = EduLinkRoles;

export default function MasterRoutes() {
  return (
    <Routes>
      {/* ════════ PUBLIC ════════ */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Route>

      {/* ════════ AUTHENTICATED ════════ */}
      <Route element={<AuthGuard />}>
        <Route element={<PasswordChangeGuard />}>
          <Route element={<DashboardLayout />}>

            {/* ── Notifications (all roles) ── */}
            <Route path="/notifications" element={<InboxPage />} />
            <Route path="/notifications/compose" element={<ComposeNotificationPage />} />

            {/* ── OPERATOR ── */}
            <Route element={<RoleGuard permitted={[OPERATOR]} />}>
              <Route path="/operator/dashboard" element={<OperatorDashboard />} />
              <Route path="/operator/users" element={<ManageUsersPage />} />
              <Route path="/operator/add-compliance-officer" element={<AddComplianceOfficerPage />} />
              <Route path="/operator/add-board-officer" element={<AddBoardOfficerPage />} />
              <Route path="/operator/add-regulator" element={<AddRegulatorPage />} />
            </Route>

            {/* ── COMPLIANCE OFFICER ── */}
            <Route element={<RoleGuard permitted={[COMPLIANCE_OFFICER]} />}>
              <Route path="/compliance/dashboard" element={<ComplianceDashboard />} />
              <Route path="/compliance/register-school" element={<RegisterSchoolPage />} />
              <Route path="/compliance/add-school-admin" element={<AddSchoolAdminPage />} />
              <Route path="/compliance/audit" element={<PerformAuditPage />} />
              <Route path="/compliance/status" element={<ViewComplianceStatusPage />} />
              <Route path="/compliance/audit-records" element={<ViewAuditRecordsPage />} />
            </Route>

            {/* ── EDUCATION BOARD OFFICER ── */}
            <Route element={<RoleGuard permitted={[EDUCATION_BOARD_OFFICER]} />}>
              <Route path="/board/dashboard" element={<BoardDashboard />} />
              <Route path="/board/schools" element={<RegisteredSchoolsPage />} />
              <Route path="/board/performance" element={<AcademicPerformancePage />} />
              <Route path="/board/reports" element={<BoardReportsPage />} />
              <Route path="/board/compliance-summary" element={<ComplianceSummaryPage />} />
            </Route>

            {/* ── REGULATOR ── */}
            <Route element={<RoleGuard permitted={[REGULATOR]} />}>
              <Route path="/regulator/dashboard" element={<RegulatorDashboard />} />
              <Route path="/regulator/compliance-reports" element={<ComplianceReportsPage />} />
              <Route path="/regulator/accreditation" element={<AccreditationPage />} />
              <Route path="/regulator/system-audit" element={<SystemAuditPage />} />
              <Route path="/regulator/audit-records" element={<RegulatorAuditRecordsPage />} />
            </Route>

            {/* ── SCHOOL ADMIN ── */}
            <Route element={<RoleGuard permitted={[SCHOOL_ADMIN]} />}>
              <Route path="/school-admin/dashboard" element={<SchoolAdminDashboard />} />
              <Route path="/school-admin/add-teacher" element={<AddTeacherPage />} />
              <Route path="/school-admin/add-student" element={<AddStudentPage />} />
              <Route path="/school-admin/teachers" element={<ViewTeachersPage />} />
              <Route path="/school-admin/students" element={<ViewStudentsPage />} />
              <Route path="/school-admin/add-course" element={<AddCoursePage />} />
              <Route path="/school-admin/add-class" element={<AddClassPage />} />
              <Route path="/school-admin/attendance-report" element={<AttendanceReportPage />} />
            </Route>

            {/* ── TEACHER ── */}
            <Route element={<RoleGuard permitted={[TEACHER]} />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/classes" element={<MyClassesPage />} />
              <Route path="/teacher/classes/:classId/students" element={<ClassRosterPage />} />
              <Route path="/teacher/upload-material" element={<UploadMaterialPage />} />
              <Route path="/teacher/new-assignment" element={<NewAssignmentPage />} />
              <Route path="/teacher/new-exam" element={<NewExamPage />} />
              <Route path="/teacher/grade" element={<GradeStudentPage />} />
              <Route path="/teacher/attendance" element={<RecordAttendancePage />} />
            </Route>

            {/* ── STUDENT ── */}
            <Route element={<RoleGuard permitted={[STUDENT]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<EnrolledCoursesPage />} />
              <Route path="/student/courses/:courseCode/materials" element={<CourseMaterialsPage />} />
              <Route path="/student/courses/:courseCode/assignments" element={<CourseAssignmentsPage />} />
              <Route path="/student/exams" element={<StudentExamsPage />} />
              <Route path="/student/submit-assignment" element={<SubmitAssignmentPage />} />
              <Route path="/student/grades" element={<ViewGradesPage />} />
              <Route path="/student/attendance" element={<ViewAttendancePage />} />
            </Route>

          </Route>
        </Route>
      </Route>

      {/* ════════ FALLBACKS ════════ */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
