import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";

export default function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    courseApi
      .fetchTeacherClasses()
      .then((res) => {
        setClasses(res.data?.data || res.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch classes:", err);
        setError(parseApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "className", label: "Class Name" },
    { key: "grade", label: "Grade" },
    { key: "section", label: "Section" },
    { key: "id", label: "Actions", render: (r) => (
        <button
          className="submit-btn"
          style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
          onClick={() => navigate(`/teacher/classes/${r.id}/students`)}
        >
          View Students
        </button>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="My Classes" subtitle=" View your assigned classes and their details." />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />
      <GenericTable
        columns={columns}
        data={classes}
        emptyMessage="No classes assigned."
        pageSize={10}
      />
    </div>
  );
}
