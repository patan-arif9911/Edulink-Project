import React from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Regulator Name" },
  { name: "email", label: "Email", type: "email", placeholder: "regulator@authority.gov" },
  { name: "dob", label: "DOB", type: "date", placeholder: "mm/dd/yyyy" },
];

export default function AddRegulatorPage() {
  return (
    <div>
      <SectionHeader title="Add Regulator" subtitle="POST /operator/create-regulator" />
      <CreateUserForm
        title="New Regulator"
        fields={fields}
        onSubmit={(data) => identityApi.createRegulator(data)}
      />
    </div>
  );
}
