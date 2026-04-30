import React, { useContext, useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import CreateUserForm from "../../components/shared/CreateUserForm";
import Spinner from "../../components/shared/Spinner";
import { AuthContext } from "../../context/AuthContext";

export default function AddStudentPage() {
  const { currentUser } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  useEffect(() => {
    courseApi.fetchAdminClasses()
      .then((res) => setClasses(res.data?.data || []))
      .catch(() => {})
      .finally(() => setClassesLoading(false));
  }, []);

  if (classesLoading) return <Spinner />;

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: `${c.className} (Grade ${c.grade}, Section ${c.section})`,
  }));

  const fields = [
    { name: "fullName", label: "Full Name", placeholder: "Student Name" },
    { name: "email", label: "Email", type: "email", placeholder: "student@school.edu" },
    { name: "classId", label: "Class Name", type: "number", options: classOptions, placeholder: "— Select a class —" },
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
