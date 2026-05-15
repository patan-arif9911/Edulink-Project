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

// ── Profile ──
import EditProfilePage from "../pages/profile/EditProfilePage";

// ── Operator ──
import OperatorDashboard from "../pages/operator/OperatorDashboard";
import ManageUsersPage from "../pages/operator/ManageUsersPage";
import AddComplianceOfficerPage from "../pages/operator/AddComplianceOfficerPage";
import AddBoardOfficerPage from "../pages/operator/AddBoardOfficerPage";
import AddRegulatorPage from "../pages/operator/AddRegulatorPage";

// ── Compliance ──
import ComplianceDashboard from "../pages/compliance/DashBoard";
import RegisterSchoolPage from "../pages/compliance/RegisterSchoolPage";
import AddSchoolAdminPage from "../pages/compliance/AddSchoolAdminPage";
import Schools from "../pages/compliance/AllSchools";
import AuditRules from "../pages/compliance/AuditRules";

// ── Board ──
import BoardDashboard from "../pages/board/DashBoard";
import CreateRules from "../pages/board/CreateRules";
import RulesActivate from "../pages/board/RulesActivate";

// ── Regulator ──
import RegulatorDashBoard from "../pages/regulator/DashBoard";
import RulesReview from "../pages/regulator/RulesReview";

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
import SubmissionsCoursePicker from "../pages/teacher/SubmissionsCoursePicker";
import ViewSubmissionsPage from "../pages/teacher/ViewSubmissionsPage";
import ExamSubmissionsPage from "../pages/teacher/ExamSubmissionsPage";
import ExamSubmissionsBrowserPage from "../pages/teacher/ExamSubmissionsBrowserPage";
import EvaluateSubmissionPage from "../pages/teacher/EvaluateSubmissionPage";
import AssignmentSubmissionsBrowserPage from "../pages/teacher/AssignmentSubmissionsBrowserPage";
import AssignmentSubmissionsPage from "../pages/teacher/AssignmentSubmissionsPage";
import EvaluateAssignmentSubmissionPage from "../pages/teacher/EvaluateAssignmentSubmissionPage";

// ── Student ──
import StudentDashboard from "../pages/student/StudentDashboard";
import EnrolledCoursesPage from "../pages/student/EnrolledCoursesPage";
import EnrollCoursePage from "../pages/student/EnrollCoursePage";
import CourseMaterialsPage from "../pages/student/CourseMaterialsPage";
import CourseAssignmentsPage from "../pages/student/CourseAssignmentsPage";
import StudentExamsPage from "../pages/student/StudentExamsPage";
import TakeExamPage from "../pages/student/TakeExamPage";
import SubmitAssignmentPage from "../pages/student/SubmitAssignmentPage";
import ViewGradesPage from "../pages/student/ViewGradesPage";
import ViewAttendancePage from "../pages/student/ViewAttendancePage";

// ── Notifications ──
import InboxPage from "../pages/notifications/InboxPage";
import ComposeNotificationPage from "../pages/notifications/ComposeNotificationPage";

// ── Shared ──
import PageNotFound from "../pages/shared/PageNotFound";
import LandingPage from "../pages/shared/LandingPage";

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
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Route>

      {/* ════════ AUTHENTICATED ════════ */}
    
      <Route element={<AuthGuard />}>
        {/* Change password – outside PasswordChangeGuard so forced-change works */}
        <Route element={<DashboardLayout />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* <Route element={<PasswordChangeGuard />}> */}
          <Route element={<DashboardLayout />}>

            {/* ── Notifications (all roles) ── */}
            <Route path="/notifications" element={<InboxPage />} />
            <Route path="/notifications/compose" element={<ComposeNotificationPage />} />

            {/* ── Profile (all roles) ── */}
            <Route path="/profile/edit" element={<EditProfilePage />} />

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
               <Route path="/compliance/Schools" element={<Schools />} />
              <Route path="/compliance/register-school" element={<RegisterSchoolPage />} />
              <Route path="/compliance/add-school-admin" element={<AddSchoolAdminPage />} />
               <Route path="/compliance/audit-records" element={<AuditRules />} />
            </Route>

            {/* ── EDUCATION BOARD OFFICER ── */}
            <Route element={<RoleGuard permitted={[EDUCATION_BOARD_OFFICER]} />}>
             <Route path="/board/dashboard" element={<BoardDashboard />} />
              <Route path="/board/create-rule" element={<CreateRules />} />
              <Route path="/board/rules-activate" element={<RulesActivate />} />
            </Route>

            {/* ── REGULATOR ── */}
            <Route element={<RoleGuard permitted={[REGULATOR]} />}>
              <Route path="/regulator/dashboard" element={<RegulatorDashBoard />} />
              <Route path="/regulator/rules-review" element={<RulesReview />} />
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
               <Route path="/teacher/submissions" element={<SubmissionsCoursePicker />} />
               <Route path="/teacher/submissions/:courseCode" element={<ViewSubmissionsPage />} />
               <Route path="/teacher/exam-submissions-browser" element={<ExamSubmissionsBrowserPage />} />
               {/* Per-exam roster: courseCode + examType identify the exam */}
               <Route path="/teacher/exam-submissions/:courseCode/:examType" element={<ExamSubmissionsPage />} />
               {/* Legacy per-course-only route — page detects missing examType and redirects to browser */}
               <Route path="/teacher/exam-submissions/:courseCode" element={<ExamSubmissionsPage />} />
               <Route path="/teacher/evaluate/:submissionId" element={<EvaluateSubmissionPage />} />
               <Route path="/teacher/assignment-submissions-browser" element={<AssignmentSubmissionsBrowserPage />} />
               <Route path="/teacher/assignment-submissions/:courseCode/:assignmentNum" element={<AssignmentSubmissionsPage />} />
               <Route path="/teacher/evaluate-assignment/:submissionId" element={<EvaluateAssignmentSubmissionPage />} />
            </Route>

            {/* ── STUDENT ── */}
            <Route element={<RoleGuard permitted={[STUDENT]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<EnrolledCoursesPage />} />
              <Route path="/student/enroll" element={<EnrollCoursePage />} />
              <Route path="/student/courses/:courseCode/materials" element={<CourseMaterialsPage />} />
              <Route path="/student/courses/:courseCode/assignments" element={<CourseAssignmentsPage />} />
              <Route path="/student/exams" element={<StudentExamsPage />} />
              <Route path="/student/exams/take/:examId" element={<TakeExamPage />} />
              <Route path="/student/submit-assignment" element={<SubmitAssignmentPage />} />
              <Route path="/student/grades" element={<ViewGradesPage />} />
              <Route path="/student/attendance" element={<ViewAttendancePage />} />
            </Route>

          </Route>
        {/* </Route> */}
      </Route>

      {/* ════════ FALLBACKS ════════ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      
    </Routes>

  );
}
