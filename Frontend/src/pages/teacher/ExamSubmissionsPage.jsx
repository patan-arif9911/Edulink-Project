import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Per-exam submissions roster.
 * Shows every student who submitted this exam (one row per submission), joined with grade if present.
 * Status:
 *   - Graded   (blue)
 *   - Submitted (green)
 *
 * Note: a "Pending" column would require a course-enrollment lookup (students enrolled in this
 * course but who haven't submitted). That endpoint doesn't exist yet — see follow-up.
 */
export default function ExamSubmissionsPage() {
  const { courseCode, examType: examTypeRaw } = useParams();
  const examType = decodeURIComponent(examTypeRaw || "");
  const navigate = useNavigate();
  const location = useLocation();
  const examMeta = location.state || {};

  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resettingRoll, setResettingRoll] = useState("");

  const missingContext = !courseCode || !examType;

  const loadAll = () => {
    if (missingContext) { setLoading(false); return; }
    setLoading(true);
    setError("");
    Promise.all([
      examApi.fetchExamSubmissions(courseCode),
      examApi.fetchGradesByExam({ courseCode, examType }),
    ])
      .then(([subsRes, gradesRes]) => {
        const allSubs = subsRes.data?.data || subsRes.data || [];
        const gradesList = gradesRes.data?.data || gradesRes.data || [];
        setSubmissions(allSubs.filter((s) => s.examType === examType));
        setGrades(Array.isArray(gradesList) ? gradesList : []);
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load submissions."))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, [courseCode, examType]);

  /** One row per submission, joined with grade if it exists. */
  const rows = useMemo(() => {
    const gradeByRoll = new Map(grades.map((g) => [g.rollNumber, g]));
    return submissions.map((submission) => {
      const grade = gradeByRoll.get(submission.rollNumber) || null;
      return {
        submission,
        grade,
        status: grade ? "GRADED" : "SUBMITTED",
      };
    });
  }, [submissions, grades]);

  const counts = useMemo(() => {
    const c = { SUBMITTED: 0, GRADED: 0 };
    rows.forEach((r) => { c[r.status]++; });
    return c;
  }, [rows]);

  const handleViewSubmission = (row) => {
    navigate(`/teacher/evaluate/${row.submission.id}`, {
      state: {
        rollNumber: row.submission.rollNumber,
        studentEmail: row.submission.studentEmail,
        courseCode,
        examType,
        examMeta,
      },
    });
  };

  const handleResetAttempt = async (rollNumber) => {
    const ok = window.confirm(
      `Reset attempt for ${rollNumber}?\n\nThis deletes their submission so they can retake the exam.`
    );
    if (!ok) return;
    setResettingRoll(rollNumber);
    setError("");
    setSuccess("");
    try {
      const res = await examApi.resetAttempt({ courseCode, examType, rollNumber });
      const deleted = res.data?.data ?? 0;
      setSuccess(
        deleted === 0
          ? `No submission to reset for ${rollNumber}.`
          : `Reset complete — ${rollNumber} can retake the exam.`
      );
      loadAll();
    } catch (err) {
      setError(parseApiError(err) || "Failed to reset attempt.");
    } finally {
      setResettingRoll("");
    }
  };

  if (loading) return <Spinner />;

  if (missingContext) {
    return (
      <div>
        <SectionHeader
          title="Pick an exam"
          subtitle="Submissions are scoped per exam — choose one from the exam list."
        />
        <div className="empty-state">
          <p>This view needs a specific exam.</p>
          <button type="button" className="submit-btn" onClick={() => navigate("/teacher/exam-submissions-browser")}>
            Go to Exam Submissions
          </button>
        </div>
      </div>
    );
  }

  const headerTitle = examMeta.examTitle
    ? `${examMeta.examTitle} — ${courseCode} (${examType})`
    : `${courseCode} · ${examType}`;

  return (
    <div>
      <SectionHeader
        title={headerTitle}
        subtitle={
          examMeta.examDate
            ? `Due ${new Date(examMeta.examDate).toLocaleString()} · ${rows.length} submission${rows.length === 1 ? "" : "s"}`
            : `${rows.length} submission${rows.length === 1 ? "" : "s"}`
        }
      />

      <AlertBanner type="error"   message={error}   onClose={() => setError("")} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />

      <div className="sub-toolbar">
        <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
        <button type="button" className="submit-btn" onClick={loadAll}>Refresh</button>
        <div className="sub-counts">
          <span className="sub-pill sub-pill-submitted is-selected">{counts.SUBMITTED} Submitted</span>
          <span className="sub-pill sub-pill-graded is-selected">{counts.GRADED} Graded</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet for this exam.</p>
        </div>
      ) : (
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Email</th>
                <th>Submission Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.submission.id}>
                  <td>{r.submission.rollNumber}</td>
                  <td>{r.submission.studentEmail}</td>
                  <td>
                    {r.submission.submittedAt
                      ? (
                        <>
                          {new Date(r.submission.submittedAt).toLocaleString()}
                          {r.submission.isLate && <span className="sub-late-tag" title="Submitted after due date"> Late</span>}
                        </>
                      )
                      : "—"}
                  </td>
                  <td><StatusPill status={r.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => handleViewSubmission(r)}
                      >
                        {r.grade ? "View Grade" : "View Submission"}
                      </button>
                      <button
                        type="button"
                        className="link-btn"
                        style={{ color: "#b91c1c" }}
                        onClick={() => handleResetAttempt(r.submission.rollNumber)}
                        disabled={resettingRoll === r.submission.rollNumber}
                        title="Delete this submission so the student can retake the exam"
                      >
                        {resettingRoll === r.submission.rollNumber ? "Resetting…" : "Reset"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    SUBMITTED: { label: "Submitted", cls: "sub-pill-submitted" },
    GRADED:    { label: "Graded",    cls: "sub-pill-graded"    },
  };
  const info = map[status] || { label: status, cls: "" };
  return <span className={`sub-pill ${info.cls} is-selected`}>{info.label}</span>;
}
