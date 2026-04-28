import { EduLinkRoles } from "./roles";

const menusByRole = {
  [EduLinkRoles.OPERATOR]: [
    { label: "Dashboard",              path: "/operator/dashboard",              icon: "dashboard" },
    { label: "All Users",              path: "/operator/users",                  icon: "people" },
    { label: "Add Compliance Officer", path: "/operator/add-compliance-officer", icon: "person_add" },
    { label: "Add Board Officer",      path: "/operator/add-board-officer",      icon: "person_add" },
    { label: "Add Regulator",          path: "/operator/add-regulator",          icon: "person_add" },
  ],

  [EduLinkRoles.COMPLIANCE_OFFICER]: [
    { label: "Dashboard",         path: "/compliance/dashboard",        icon: "dashboard" },
    { label: "Register School",   path: "/compliance/register-school",  icon: "add_business" },
    { label: "Add School Admin",  path: "/compliance/add-school-admin", icon: "admin_panel_settings" },
    { label: "Audit School",      path: "/compliance/audit",            icon: "fact_check" },
    { label: "Compliance Status", path: "/compliance/status",           icon: "verified" },
    { label: "Audit Records",     path: "/compliance/audit-records",    icon: "history" },
  ],

  [EduLinkRoles.EDUCATION_BOARD_OFFICER]: [
    { label: "Dashboard",              path: "/board/dashboard",           icon: "dashboard" },
    { label: "Registered Schools",     path: "/board/schools",             icon: "school" },
    { label: "Academic Performance",   path: "/board/performance",         icon: "trending_up" },
    { label: "Board Reports",          path: "/board/reports",             icon: "assessment" },
    { label: "Compliance Summary",     path: "/board/compliance-summary",  icon: "checklist" },
  ],

  [EduLinkRoles.REGULATOR]: [
    { label: "Dashboard",           path: "/regulator/dashboard",           icon: "dashboard" },
    { label: "Compliance Reports",  path: "/regulator/compliance-reports",  icon: "description" },
    { label: "Accreditation",       path: "/regulator/accreditation",       icon: "workspace_premium" },
    { label: "System Audit",        path: "/regulator/system-audit",        icon: "security" },
    { label: "Audit Records",       path: "/regulator/audit-records",       icon: "history" },
  ],

  [EduLinkRoles.SCHOOL_ADMIN]: [
    { label: "Dashboard",          path: "/school-admin/dashboard",         icon: "dashboard" },
    { label: "Add Teacher",        path: "/school-admin/add-teacher",       icon: "person_add" },
    { label: "Add Student",        path: "/school-admin/add-student",       icon: "person_add" },
    { label: "View Teachers",      path: "/school-admin/teachers",          icon: "groups" },
    { label: "View Students",      path: "/school-admin/students",          icon: "groups" },
    { label: "Create Course",      path: "/school-admin/add-course",        icon: "menu_book" },
    { label: "Create Class",       path: "/school-admin/add-class",         icon: "class" },
    { label: "Attendance Report",  path: "/school-admin/attendance-report", icon: "bar_chart" },
  ],

  [EduLinkRoles.TEACHER]: [
    { label: "Dashboard",           path: "/teacher/dashboard",       icon: "dashboard" },
    { label: "My Classes",          path: "/teacher/classes",         icon: "class" },
    { label: "Upload Material",     path: "/teacher/upload-material", icon: "cloud_upload" },
    { label: "New Assignment",      path: "/teacher/new-assignment",  icon: "assignment" },
    { label: "View Submissions",    path: "/teacher/submissions",     icon: "fact_check" },
    { label: "New Exam",            path: "/teacher/new-exam",        icon: "quiz" },
    { label: "Grade Student",       path: "/teacher/grade",           icon: "grading" },
    { label: "Mark Attendance",     path: "/teacher/attendance",      icon: "how_to_reg" },
  ],

  [EduLinkRoles.STUDENT]: [
    { label: "Dashboard",         path: "/student/dashboard",        icon: "dashboard" },
    { label: "My Courses",        path: "/student/courses",          icon: "menu_book" },
    { label: "Enroll in Course",  path: "/student/enroll",           icon: "add_circle" },
    { label: "My Exams",          path: "/student/exams",            icon: "quiz" },
    { label: "Submit Assignment", path: "/student/submit-assignment", icon: "upload_file" },
    { label: "My Grades",         path: "/student/grades",           icon: "grade" },
    { label: "My Attendance",     path: "/student/attendance",       icon: "event_available" },
  ],
};

export function getMenuForRole(role) {
  return menusByRole[role] || [];
}

export default menusByRole;
