import React, { useState, useEffect } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function ViewGradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    studentApi
      .fetchGrades()
      .then((res) => setGrades(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  /* Backend response fields per grade (from exam-service):
     id, courseCode, examType, rollNumber, studentEmail, teacherEmail,
     marksObtained, totalMarks, passingMarks, grade, remarks, gradedAt */
  const columns = [
    { key: "courseCode", label: "Course" },
    { key: "examType", label: "Exam Type" },
    { key: "marksObtained", label: "Marks" },
    { key: "totalMarks", label: "Total" },
    {
      key: "percentage",
      label: "Percentage",
      render: (r) =>
        r.totalMarks > 0
          ? `${((r.marksObtained / r.totalMarks) * 100).toFixed(1)}%`
          : "—",
    },
    { key: "grade", label: "Grade" },
    { key: "remarks", label: "Remarks" },
    { key: "teacherEmail", label: "Graded By" },
    {
      key: "gradedAt",
      label: "Graded On",
      render: (r) => formatDateTime(r.gradedAt),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="My Grades" subtitle="Exam results and grades" />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <GenericTable
        columns={columns}
        data={grades}
        emptyMessage="No grades available yet."
      />
    </div>
  );
}
