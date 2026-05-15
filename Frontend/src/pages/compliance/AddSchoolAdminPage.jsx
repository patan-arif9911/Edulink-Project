import React from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";
import { toast } from "react-toastify";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Admin Name" },
  { name: "email", label: "Email", type: "email", placeholder: "admin@school.edu" },
  { name: "schoolId", label: "School ID", placeholder: "SCH001" },
  { name: "dob", label: "DOB", placeholder: "mm/dd/yy",type:"date" },
];


const isAdult = (dataValidation) => {
  const dob=dataValidation.dob;
  if (!dob) return false;

  const today = new Date();
  const birth = new Date(dob);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if(age>18){
    return true;
  }
  toast.error("DOB should be 18 or more than 18")
  return false;
};

export default function AddSchoolAdminPage() {
  return (
    <div>
      <SectionHeader title="Add School Admin" subtitle="" />
      <CreateUserForm
        title="New School Administrator"
        fields={fields}
        validate={isAdult}
        onSubmit={(data) => identityApi.createSchoolAdmin(data)}
      />
    </div>
  );
}
