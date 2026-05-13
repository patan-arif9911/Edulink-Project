import React from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Jane Smith" },
  { name: "email", label: "Email", type: "email", placeholder: "board@education.gov" },
  { name: "dob", label: "DOB", type: "date", placeholder: "mm/dd/yyyy" },
];

export default function AddBoardOfficerPage() {
  return (
    <div>
      <SectionHeader
        title="Add Education Board Officer"
        subtitle="POST /operator/create-board-officer"
      />
      <CreateUserForm
        title="New Board Officer"
        fields={fields}
        onSubmit={(data) => identityApi.createBoardOfficer(data)}
      />
    </div>
  );
}
