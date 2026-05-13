import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentApi from "../../api/studentApi";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function StudentExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExams = async () => {
    setLoading(true);
    setError("");
    try {
      const coursesRes = await studentApi.fetchEnrolledCourses();
      const courses = coursesRes.data?.data || [];
      const courseCodes = courses.map((c) => c.courseCode).filter(Boolean);

      if (courseCodes.length === 0) {
        setExams([]);
        return;
      }

      const examsRes = await examApi.fetchStudentExams(courseCodes);
      setExams(examsRes.data?.data || []);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* Backend response fields per exam:
     id, courseCode, teacherEmail, examTitle, examType, totalMarks, passingMarks,
     schoolId, questionsFileId, examDate, durationMinutes, createdAt */
  const columns = [
    { key: "examTitle", label: "Exam" },
    { key: "courseCode", label: "Course" },
    { key: "examType", label: "Type" },
    { key: "totalMarks", label: "Total Marks" },
    { key: "passingMarks", label: "Passing" },
    {
      key: "durationMinutes",
      label: "Duration",
      render: (r) => (r.durationMinutes ? `${r.durationMinutes} min` : "—"),
    },
    {
      key: "examDate",
      label: "Date",
      render: (r) => formatDateTime(r.examDate),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button
          className="submit-btn"
          style={{ padding: "0.3rem 0.75rem", fontSize: "0.82rem" }}
          onClick={() =>
            navigate(`/student/exams/take/${r.id}`, {
              state: {
                exam: r,
              },
            })
          }
        >
          Start Exam
        </button>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="My Exams" subtitle="Click Start Exam to begin. Timer starts when you click." />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <GenericTable
        columns={columns}
        data={exams}
        emptyMessage="No exams available. Enroll in courses first."
      />
    </div>
  );
}
