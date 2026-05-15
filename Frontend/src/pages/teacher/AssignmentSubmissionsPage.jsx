import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import courseApi from "../../api/courseApi";
// useNavigate is also used for navigating to the Evaluate page
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Per-assignment submissions roster. Lists every student who submitted the chosen assignment.
 *
 * Status field on AssignmentSubmission (set by backend): SUBMITTED | GRADED | LATE.
 *  - SUBMITTED → green
 *  - GRADED    → blue
 *  - LATE      → orange "Late" tag next to date, status shown as Submitted
 */
export default function AssignmentSubmissionsPage() {
  const { courseCode, assignmentNum: assignmentNumRaw } = useParams();
  const assignmentNum = Number(assignmentNumRaw);
  const navigate = useNavigate();
  const location = useLocation();
  const meta = location.state || {};

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const missingContext = !courseCode || Number.isNaN(assignmentNum);

  const loadSubmissions = () => {
    if (missingContext) { setLoading(false); return; }
    setLoading(true);
    setError("");
    courseApi
      .fetchSubmissions(courseCode)
      .then((res) => {
        const all = res.data?.data || res.data || [];
        // Backend returns all submissions for the course; filter to just this assignment number.
        setSubmissions(all.filter((s) => Number(s.assignmentNum) === assignmentNum));
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load submissions."))
      .finally(() => setLoading(false));
  };

  useEffect(loadSubmissions, [courseCode, assignmentNum]);

  const counts = useMemo(() => {
    const c = { SUBMITTED: 0, GRADED: 0, LATE: 0 };
    submissions.forEach((s) => {
      const k = (s.status || "SUBMITTED").toUpperCase();
      if (c[k] !== undefined) c[k]++;
      else c.SUBMITTED++;
    });
    return c;
  }, [submissions]);

  const handleDownload = async (sub) => {
    if (!sub.fileId) return;
    setDownloadingId(sub.id);
    try {
      const res = await courseApi.downloadSubmission(sub.fileId);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = sub.fileName || `submission_${sub.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err) || "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <Spinner />;

  if (missingContext) {
    return (
      <div>
        <SectionHeader title="Pick an assignment" subtitle="Submissions are scoped per assignment." />
        <div className="empty-state">
          <p>This view needs a specific assignment.</p>
          <button type="button" className="submit-btn" onClick={() => navigate("/teacher/assignment-submissions-browser")}>
            Go to Assignment Submissions
          </button>
        </div>
      </div>
    );
  }

  const headerTitle = meta.title
    ? `${meta.title} — ${courseCode} (Assignment #${assignmentNum})`
    : `${courseCode} · Assignment #${assignmentNum}`;

  return (
    <div>
      <SectionHeader
        title={headerTitle}
        subtitle={
          meta.dueDate
            ? `Due ${new Date(meta.dueDate).toLocaleString()} · ${submissions.length} submission${submissions.length === 1 ? "" : "s"}`
            : `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`
        }
      />

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="sub-toolbar">
        <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
        <button type="button" className="submit-btn" onClick={loadSubmissions}>Refresh</button>
        <div className="sub-counts">
          <span className="sub-pill sub-pill-submitted is-selected">{counts.SUBMITTED} Submitted</span>
          {counts.LATE > 0 && <span className="sub-pill sub-pill-pending is-selected">{counts.LATE} Late</span>}
          {counts.GRADED > 0 && <span className="sub-pill sub-pill-graded is-selected">{counts.GRADED} Graded</span>}
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet for this assignment.</p>
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
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.rollNumber ?? "—"}</td>
                  <td>{s.studentEmail ?? "—"}</td>
                  <td>
                    {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "—"}
                    {(s.status || "").toUpperCase() === "LATE" && (
                      <span className="sub-late-tag" title="Submitted after due date"> Late</span>
                    )}
                  </td>
                  <td><StatusPill status={s.status} /></td>
                  <td>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() =>
                        navigate(`/teacher/evaluate-assignment/${s.id}`, { state: { meta } })
                      }
                    >
                      {s.marksObtained != null ? "Update Grade" : "Grade"}
                    </button>
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
  const normalised = (status || "SUBMITTED").toUpperCase();
  const map = {
    SUBMITTED: { label: "Submitted", cls: "sub-pill-submitted" },
    GRADED:    { label: "Graded",    cls: "sub-pill-graded"    },
    LATE:      { label: "Submitted", cls: "sub-pill-submitted" }, // status shown as Submitted; lateness is in the date column
  };
  const info = map[normalised] || { label: normalised, cls: "sub-pill-submitted" };
  return <span className={`sub-pill ${info.cls} is-selected`}>{info.label}</span>;
}
