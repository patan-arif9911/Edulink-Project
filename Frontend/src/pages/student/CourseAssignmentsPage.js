import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function CourseAssignmentsPage() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    studentApi
      .fetchAssignments(courseCode)
      .then((res) => setAssignments(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [courseCode]);

  /* Backend response fields per assignment:
     assignmentNum, courseCode, teacherEmail, title, description,
     dueDate, maxMarks, createdAt, questionsFileId */
  const columns = [
    { key: "assignmentNum", label: "#" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    {
      key: "dueDate",
      label: "Due Date",
      render: (r) => formatDateTime(r.dueDate),
    },
    { key: "maxMarks", label: "Max Marks" },
    { key: "teacherEmail", label: "Assigned By" },
    {
      key: "createdAt",
      label: "Created",
      render: (r) => formatDateTime(r.createdAt),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title={`Assignments — ${courseCode}`}
        subtitle="View assignments for this course"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <button
          className="submit-btn"
          onClick={() => navigate("/student/courses")}
        >
          ← Back to Courses
        </button>
        <button
          className="submit-btn"
          onClick={() => navigate("/student/submit-assignment")}
        >
          Submit Assignment
        </button>
      </div>
      <GenericTable
        columns={columns}
        data={assignments}
        emptyMessage="No assignments yet for this course."
      />
    </div>
  );
}
