import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ViewTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    identityApi
      .fetchTeachers()
      .then((res) => setTeachers(res.data?.data || res.data || []))
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
      <SectionHeader title="Teachers" subtitle="GET /admin/teachers" />
      <GenericTable columns={columns} data={teachers} emptyMessage="No teachers found." />
    </div>
  );
}
