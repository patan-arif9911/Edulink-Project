import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ViewStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    identityApi
      .fetchStudents()
      .then((res) => setStudents(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Students" subtitle="GET /admin/students" />
      <GenericTable columns={columns} data={students} emptyMessage="No students found." />
    </div>
  );
}
