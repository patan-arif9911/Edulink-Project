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
  const [enrollCode, setEnrollCode] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const loadCourses = () => {
    setLoading(true);
    studentApi
      .fetchEnrolledCourses()
      .then((res) => setCourses(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const code = enrollCode.trim().toUpperCase();
    if (!code) {
      setError("Please enter a course code.");
      return;
    }
    setEnrolling(true);
    try {
      const res = await studentApi.enrollCourse(code);
      const enrolled = res.data?.data;
      setSuccess(
        `Successfully enrolled in ${enrolled?.courseName || code}!`
      );
      setEnrollCode("");
      loadCourses();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setEnrolling(false);
    }
  };

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
        subtitle="View enrolled courses and enroll in new ones"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <AlertBanner
        type="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      {/* Enroll form */}
      <div className="page-form" style={{ marginBottom: "1.5rem" }}>
        <form
          onSubmit={handleEnroll}
          style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}
        >
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Enroll in a new course</label>
            <input
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value)}
              placeholder="Enter course code (e.g. MATH101)"
              disabled={enrolling}
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={enrolling}
            style={{ height: "38px" }}
          >
            {enrolling ? "Enrolling…" : "Enroll"}
          </button>
        </form>
      </div>

      <GenericTable
        columns={columns}
        data={courses}
        emptyMessage="No enrolled courses yet. Enter a course code above to enroll."
      />
    </div>
  );
}
