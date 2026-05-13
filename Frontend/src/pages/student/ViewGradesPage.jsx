import React, { useEffect, useMemo, useState } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

/**
 * Student's grades dashboard. Merges two sources:
 *  - Exam grades from /exam/student/grades (exam-service `grades` table)
 *  - Assignment grades from /student/my-grades/assignments (student-service `assignment_submissions`
 *    rows that have marksObtained set)
 *
 * Toggle "All / Exams / Assignments" filters the unified table.
 */
export default function ViewGradesPage() {
  const [examGrades, setExamGrades] = useState([]);
  const [assignmentGrades, setAssignmentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | EXAM | ASSIGNMENT

  useEffect(() => {
    setLoading(true);
    Promise.all([
      studentApi.fetchGrades().catch(() => ({ data: { data: [] } })),
      studentApi.fetchAssignmentGrades().catch(() => ({ data: { data: [] } })),
    ])
      .then(([examsRes, assignmentsRes]) => {
        setExamGrades(examsRes.data?.data || []);
        setAssignmentGrades(assignmentsRes.data?.data || []);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  /* Normalise both shapes into a single row type with a discriminator. */
  const allRows = useMemo(() => {
    const examRows = examGrades.map((g) => ({
      type: "EXAM",
      typeLabel: `Exam · ${g.examType || "—"}`,
      key: `exam-${g.id}`,
      courseCode: g.courseCode,
      marksObtained: g.marksObtained,
      totalMarks: g.totalMarks,
      letterGrade: g.grade,
      remarks: g.remarks,
      gradedBy: g.teacherEmail,
      gradedAt: g.gradedAt,
    }));
    const assignmentRows = assignmentGrades.map((s) => ({
      type: "ASSIGNMENT",
      typeLabel: `Assignment #${s.assignmentNum}`,
      key: `assignment-${s.id}`,
      courseCode: s.courseCode,
      title: s.assignmentTitle,
      marksObtained: s.marksObtained,
      totalMarks: s.maxMarks,
      letterGrade: null,
      remarks: s.remarks,
      gradedBy: s.evaluatedBy,
      gradedAt: s.evaluatedAt,
    }));
    return [...examRows, ...assignmentRows]
      .sort((a, b) => String(b.gradedAt || "").localeCompare(String(a.gradedAt || "")));
  }, [examGrades, assignmentGrades]);

  const filteredRows = useMemo(() => {
    if (filter === "ALL") return allRows;
    return allRows.filter((r) => r.type === filter);
  }, [allRows, filter]);

  const columns = [
    {
      key: "typeLabel",
      label: "Type",
      render: (r) => (
        <span
          className={`sub-pill ${r.type === "EXAM" ? "sub-pill-graded" : "sub-pill-submitted"} is-selected`}
          style={{ fontSize: "0.72rem" }}
        >
          {r.typeLabel}
        </span>
      ),
    },
    { key: "courseCode", label: "Course" },
    {
      key: "title",
      label: "Title",
      render: (r) => r.title || "—",
    },
    {
      key: "marks",
      label: "Marks",
      render: (r) =>
        r.marksObtained != null && r.totalMarks != null
          ? `${r.marksObtained} / ${r.totalMarks}`
          : "—",
    },
    {
      key: "percentage",
      label: "%",
      render: (r) =>
        r.totalMarks > 0
          ? `${((r.marksObtained / r.totalMarks) * 100).toFixed(1)}%`
          : "—",
    },
    {
      key: "letterGrade",
      label: "Grade",
      render: (r) => r.letterGrade || "—",
    },
    {
      key: "remarks",
      label: "Feedback",
      render: (r) => r.remarks || "—",
    },
    { key: "gradedBy", label: "Graded By" },
    {
      key: "gradedAt",
      label: "Graded On",
      render: (r) => formatDateTime(r.gradedAt),
    },
  ];

  if (loading) return <Spinner />;

  const counts = {
    ALL: allRows.length,
    EXAM: examGrades.length,
    ASSIGNMENT: assignmentGrades.length,
  };

  return (
    <div>
      <SectionHeader title="My Grades" subtitle="Exam and assignment results" />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="sub-toolbar">
        <button
          type="button"
          className={`submit-btn${filter === "ALL" ? "" : " secondary"}`}
          onClick={() => setFilter("ALL")}
        >
          All ({counts.ALL})
        </button>
        <button
          type="button"
          className={`submit-btn${filter === "EXAM" ? "" : " secondary"}`}
          onClick={() => setFilter("EXAM")}
        >
          Exams ({counts.EXAM})
        </button>
        <button
          type="button"
          className={`submit-btn${filter === "ASSIGNMENT" ? "" : " secondary"}`}
          onClick={() => setFilter("ASSIGNMENT")}
        >
          Assignments ({counts.ASSIGNMENT})
        </button>
      </div>

      <GenericTable
        columns={columns}
        data={filteredRows}
        emptyMessage={
          filter === "ASSIGNMENT"
            ? "No assignment grades yet."
            : filter === "EXAM"
              ? "No exam grades yet."
              : "No grades available yet."
        }
        rowKey={(r) => r.key}
      />
    </div>
  );
}
