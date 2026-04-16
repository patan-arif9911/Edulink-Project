import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    identityApi
      .fetchAllUsers()
      .then((res) => setUsers(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "schoolId", label: "School ID" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="All Users" subtitle="Users registered across the platform" />
      <GenericTable columns={columns} data={users} emptyMessage="No users found." />
    </div>
  );
}
