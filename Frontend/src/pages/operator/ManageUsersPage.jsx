import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    identityApi
      .fetchAllUsers()
      .then((res) => {
        setUsers(res.data?.data || res.data || []);
        setError("");
      })
      .catch((err) => {
        setError(parseApiError(err));
        console.error("Failed to fetch users:", err);
      })
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
      <SectionHeader
        title="All Users"
        subtitle="Users registered across the platform"
      />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />
      <GenericTable
        columns={columns}
        data={users}
        emptyMessage="No users found."
        pageSize={10}
      />
    </div>
  );
}
