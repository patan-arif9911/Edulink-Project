import React, { useContext } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";
import { AuthContext } from "../../context/AuthContext";

export default function AddStudentPage() {
  const { currentUser } = useContext(AuthContext);

  const fields = [
    { name: "fullName", label: "Full Name", placeholder: "Student Name" },
    { name: "email", label: "Email", type: "email", placeholder: "student@school.edu" },
    { name: "schoolId", label: "School ID", placeholder: "SCH001" },
    { name: "classId", label: "Class ID", type: "number", placeholder: "1" },
  ];

  return (
    <div>
      <SectionHeader title="Add Student" subtitle="POST /admin/create-student" />
      <CreateUserForm
        title="New Student"
        fields={fields}
        defaultValues={{ schoolId: currentUser?.schoolId || "" }}
        onSubmit={(data) => identityApi.createStudent(data)}
      />
    </div>
  );
}
