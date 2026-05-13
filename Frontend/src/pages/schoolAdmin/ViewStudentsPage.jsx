import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function ViewStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadStudents = () => {
    setLoading(true);
    identityApi
      .fetchStudents()
      .then((res) => setStudents(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) return;
    try {
      await identityApi.deleteStudent(id);
      setSuccess(`Student "${name}" deleted successfully.`);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button
          className="submit-btn"
          style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem", background: "#d32f2f" }}
          onClick={() => handleDelete(r.id, r.fullName)}
        >
          Delete
        </button>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Students" subtitle="Manage your students and their details." />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
      <GenericTable columns={columns} data={students} emptyMessage="No students found." />
    </div>
  );
}
