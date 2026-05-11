import React from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Admin Name" },
  { name: "email", label: "Email", type: "email", placeholder: "admin@school.edu" },
  { name: "schoolId", label: "School ID", placeholder: "SCH001" },
  { name: "dob", label: "DOB", placeholder: "mm/dd/yy",type:"date" },
];


export default function AddSchoolAdminPage() {
  return (
    <div>
      <SectionHeader title="Add School Admin" subtitle="" />
      <CreateUserForm
        title="New School Administrator"
        fields={fields}
        onSubmit={(data) => identityApi.createSchoolAdmin(data)}
      />
    </div>
  );
}
