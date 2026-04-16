import React, { useContext } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";
import { AuthContext } from "../../context/AuthContext";

export default function AddTeacherPage() {
  const { currentUser } = useContext(AuthContext);

  const fields = [
    { name: "fullName", label: "Full Name", placeholder: "Teacher Name" },
    { name: "email", label: "Email", type: "email", placeholder: "teacher@school.edu" },
    { name: "schoolId", label: "School ID", placeholder: "SCH001" },
    { name: "classId", label: "Class ID", type: "number", placeholder: "1", required: false },
  ];

  return (
    <div>
      <SectionHeader title="Add Teacher" subtitle="POST /admin/create-teacher" />
      <CreateUserForm
        title="New Teacher"
        fields={fields}
        defaultValues={{ schoolId: currentUser?.schoolId || "" }}
        onSubmit={(data) => identityApi.createTeacher(data)}
      />
    </div>
  );
}
