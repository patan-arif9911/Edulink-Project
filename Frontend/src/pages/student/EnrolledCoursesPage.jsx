import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import StatusPill from "../../components/shared/StatusPill";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    studentApi
      .fetchEnrolledCourses()
      .then((res) => setCourses(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);


  /* Backend response fields:
     id, studentId, courseId, courseName, courseCode, status, enrolledAt */
  const columns = [
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course Name" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: "enrolledAt",
      label: "Enrolled On",
      render: (r) => formatDateTime(r.enrolledAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="submit-btn"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={() =>
              navigate(`/student/courses/${r.courseCode}/materials`)
            }
          >
            Materials
          </button>
          <button
            className="submit-btn"
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
            onClick={() =>
              navigate(`/student/courses/${r.courseCode}/assignments`)
            }
          >
            Assignments
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="My Courses"
        subtitle="View your enrolled courses"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <GenericTable
        columns={columns}
        data={courses}
        emptyMessage="No enrolled courses yet."
      />
    </div>
  );
}
