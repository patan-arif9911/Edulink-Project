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
    {label: "Dashboard",         path: "/compliance/dashboard",        icon: "dashboard" },
    { label: "Schools",         path: "/compliance/Schools",        icon: "fact_check" },
    { label: "Register School",   path: "/compliance/register-school",  icon: "add_business" },
    { label: "Add School Admin",  path: "/compliance/add-school-admin", icon: "admin_panel_settings" },
    { label: "Audit Records",     path: "/compliance/audit-records",    icon: "history" },

  ],

  [EduLinkRoles.EDUCATION_BOARD_OFFICER]: [
     { label: "Dashboard",              path: "/board/dashboard",           icon: "dashboard" },
    { label: "Create Rule",            path: "/board/create-rule",         icon: "add_circle" },
    { label: "Activate Rules",         path: "/board/rules-activate",     icon: "toggle_on" },

  ],

  [EduLinkRoles.REGULATOR]: [
     { label: "Dashboard",           path: "/regulator/dashboard",           icon: "dashboard" },
    { label: "Rules Review",        path: "/regulator/rules-review",        icon: "flag" },

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
    { label: "Dashboard",                path: "/teacher/dashboard",                       icon: "dashboard" },
    { label: "My Classes",               path: "/teacher/classes",                         icon: "class" },
    { label: "Upload Material",          path: "/teacher/upload-material",                 icon: "cloud_upload" },
    { label: "New Assignment",           path: "/teacher/new-assignment",                  icon: "assignment" },
    { label: "Assignment Submissions",   path: "/teacher/assignment-submissions-browser",  icon: "fact_check" },
    { label: "New Exam",                 path: "/teacher/new-exam",                        icon: "quiz" },
    { label: "Exam Submissions",         path: "/teacher/exam-submissions-browser",        icon: "fact_check" },
    { label: "View Grades",              path: "/teacher/grade",                           icon: "grading" },
    { label: "Mark Attendance",          path: "/teacher/attendance",                      icon: "how_to_reg" },
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
