import React from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "John Doe" },
  { name: "email", label: "Email", type: "email", placeholder: "officer@gov.edu" },
  { name: "dob", label: "DOB", type: "date", placeholder: "mm/dd/yyyy" },
];

export default function AddComplianceOfficerPage() {
  return (
    <div>
      <SectionHeader
        title="Add Compliance Officer"
        subtitle="POST /operator/create-compliance-officer"
      />
      <CreateUserForm
        title="New Compliance Officer"
        fields={fields}
        onSubmit={(data) => identityApi.createComplianceOfficer(data)}
      />
    </div>
  );
}
