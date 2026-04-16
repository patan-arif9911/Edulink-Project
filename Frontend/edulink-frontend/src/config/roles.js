const EduLinkRoles = Object.freeze({
  OPERATOR: "OPERATOR",
  COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
  EDUCATION_BOARD_OFFICER: "EDUCATION_BOARD_OFFICER",
  REGULATOR: "REGULATOR",
  SCHOOL_ADMIN: "SCHOOL_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
});

const roleLabelMap = {
  [EduLinkRoles.OPERATOR]: "System Operator",
  [EduLinkRoles.COMPLIANCE_OFFICER]: "Compliance Officer",
  [EduLinkRoles.EDUCATION_BOARD_OFFICER]: "Education Board Officer",
  [EduLinkRoles.REGULATOR]: "Regulator",
  [EduLinkRoles.SCHOOL_ADMIN]: "School Administrator",
  [EduLinkRoles.TEACHER]: "Teacher",
  [EduLinkRoles.STUDENT]: "Student",
};

const roleDashboardMap = {
  [EduLinkRoles.OPERATOR]: "/operator/dashboard",
  [EduLinkRoles.COMPLIANCE_OFFICER]: "/compliance/dashboard",
  [EduLinkRoles.EDUCATION_BOARD_OFFICER]: "/board/dashboard",
  [EduLinkRoles.REGULATOR]: "/regulator/dashboard",
  [EduLinkRoles.SCHOOL_ADMIN]: "/school-admin/dashboard",
  [EduLinkRoles.TEACHER]: "/teacher/dashboard",
  [EduLinkRoles.STUDENT]: "/student/dashboard",
};

const getRoleLabel = (role) => roleLabelMap[role] || "Unknown Role";
const getDashboardPath = (role) => roleDashboardMap[role] || "/";

export { EduLinkRoles, roleLabelMap, roleDashboardMap, getRoleLabel, getDashboardPath };
