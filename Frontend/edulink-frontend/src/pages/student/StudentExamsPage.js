import React, { useState, useEffect, useContext } from "react";
import studentApi from "../../api/studentApi";
import examApi from "../../api/examApi";
import { AuthContext } from "../../context/AuthContext";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function StudentExamsPage() {
  const { currentUser } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitModal, setSubmitModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExams = async () => {
    setLoading(true);
    setError("");
    try {
      /* Step 1: Fetch enrolled courses to get their codes */
      const coursesRes = await studentApi.fetchEnrolledCourses();
      const courses = coursesRes.data?.data || [];
      const courseCodes = courses.map((c) => c.courseCode).filter(Boolean);

      if (courseCodes.length === 0) {
        setExams([]);
        setLoading(false);
        return;
      }

      /* Step 2: Fetch exams for those course codes
         GET /exam/student/exams?courseCodes=CODE1&courseCodes=CODE2 */
      const examsRes = await examApi.fetchStudentExams(courseCodes);
      setExams(examsRes.data?.data || []);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (examId) => {
    try {
      const res = await examApi.downloadExamQuestions(examId);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `exam_${examId}_questions.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const handleSubmitExam = async () => {
    if (!submissionText.trim()) {
      setError("Please enter your submission content.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      /* POST /exam/student/submit
         body: { examId, studentEmail, submissionContent } */
      await examApi.submitExam({
        examId: submitModal,
        studentEmail: currentUser?.email,
        submissionContent: submissionText.trim(),
      });
      setSuccess("Exam submitted successfully!");
      setSubmitModal(null);
      setSubmissionText("");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* Backend response fields per exam:
     courseCode, teacherEmail, examTitle, examType, totalMarks,
     passingMarks, schoolId, questionsFileId, examDate, createdAt */
  const columns = [
    { key: "examTitle", label: "Exam" },
    { key: "courseCode", label: "Course" },
    { key: "examType", label: "Type" },
    { key: "totalMarks", label: "Total Marks" },
    { key: "passingMarks", label: "Passing" },
    {
      key: "examDate",
      label: "Date",
      render: (r) => formatDateTime(r.examDate),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {r.questionsFileId && (
            <button
              className="submit-btn"
              style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem" }}
              onClick={() => handleDownload(r.courseCode)}
            >
              Questions
            </button>
          )}
          <button
            className="submit-btn"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem" }}
            onClick={() => {
              setSubmitModal(r.courseCode);
              setSubmissionText("");
              setSuccess("");
            }}
          >
            Submit
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="My Exams"
        subtitle="View and submit your exams"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <AlertBanner
        type="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      <GenericTable
        columns={columns}
        data={exams}
        emptyMessage="No exams available. Enroll in courses first."
      />

      {/* Submit Exam Modal */}
      {submitModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSubmitModal(null)}
        >
          <div
            className="page-form"
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Submit Exam: {submitModal}
            </h3>
            <div className="form-group">
              <label>Your Answer / Submission</label>
              <textarea
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                disabled={submitting}
                placeholder="Type your answers here…"
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="submit-btn"
                onClick={handleSubmitExam}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
              <button
                className="submit-btn"
                style={{ background: "#666" }}
                onClick={() => setSubmitModal(null)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
