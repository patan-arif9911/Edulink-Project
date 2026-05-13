import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Teacher's per-assignment-submission grading page.
 *  - Loaded from AssignmentSubmissionsPage's "Grade" button.
 *  - Left panel: student details + submission content + file download link.
 *  - Right panel: marks input + feedback textarea + Save Grade.
 *  - Already graded? Form pre-fills with existing values and allows re-grade (saves overwrite).
 */
export default function EvaluateAssignmentSubmissionPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passed = location.state || {};
  // meta is the assignment metadata captured from the list page so we can pre-fill maxMarks
  const meta = passed.meta || {};

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [form, setForm] = useState({
    marksObtained: "",
    maxMarks: String(meta.maxMarks ?? ""),
    remarks: "",
  });

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    setError("");
    courseApi
      .fetchAssignmentSubmissionById(submissionId)
      .then((res) => {
        const sub = res.data?.data || res.data;
        setSubmission(sub);
        // Pre-fill if already graded
        if (sub?.marksObtained != null) {
          setForm({
            marksObtained: String(sub.marksObtained),
            maxMarks: String(sub.maxMarks ?? meta.maxMarks ?? ""),
            remarks: sub.remarks || "",
          });
        }
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load submission."))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const handleDownload = async () => {
    if (!submission?.fileId) return;
    setDownloading(true);
    try {
      const res = await courseApi.downloadSubmission(submission.fileId);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = submission.fileName || `submission_${submission.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err) || "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const marks = Number(form.marksObtained);
    const max = Number(form.maxMarks);
    if (Number.isNaN(marks) || marks < 0) { setError("Enter a valid marks obtained."); return; }
    if (Number.isNaN(max) || max <= 0) { setError("Max marks must be greater than zero."); return; }
    if (marks > max) { setError("Marks obtained cannot exceed max marks."); return; }
    if ((form.remarks || "").length > 500) { setError("Feedback must be 500 characters or fewer."); return; }

    setSaving(true);
    try {
      const res = await courseApi.gradeAssignmentSubmission(submissionId, {
        marksObtained: marks,
        maxMarks: max,
        remarks: form.remarks,
      });
      const saved = res.data?.data || res.data;
      setSubmission(saved);
      setSuccess(`Saved. ${saved?.marksObtained}/${saved?.maxMarks}.`);
    } catch (err) {
      setError(parseApiError(err) || "Failed to save grade.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!submission) {
    return (
      <div>
        <SectionHeader title="Evaluate Assignment Submission" />
        <AlertBanner type="error" message={error || "Submission not found."} />
        <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const isGraded = submission.marksObtained != null;
  const lateFlag = (submission.status || "").toUpperCase() === "LATE"
    ? <span className="sub-late-tag">Late</span>
    : null;

  return (
    <div>
      <SectionHeader
        title={`Evaluate: ${submission.assignmentTitle || `Assignment #${submission.assignmentNum}`}`}
        subtitle={`${submission.courseCode} · Assignment #${submission.assignmentNum} · submitted ${new Date(submission.submittedAt).toLocaleString()}`}
      />

      <AlertBanner type="error"   message={error}   onClose={() => setError("")} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />

      <div className="eval-grid">
        <section className="eval-panel">
          <header className="eval-panel-head">
            <h3 style={{ margin: 0 }}>Submission</h3>
            {lateFlag}
          </header>
          <dl className="eval-meta">
            <div><dt>Student ID</dt><dd>{submission.studentId ?? "—"}</dd></div>
            <div><dt>Course</dt><dd>{submission.courseCode}</dd></div>
            <div><dt>Assignment #</dt><dd>{submission.assignmentNum}</dd></div>
            <div><dt>Status</dt><dd>{submission.status}</dd></div>
          </dl>
          <h4 style={{ marginBottom: "0.4rem" }}>Text Answer</h4>
          <pre className="eval-answer">
            {submission.submissionContent || "(no text content)"}
          </pre>
          {submission.fileId && (
            <div style={{ marginTop: "0.6rem" }}>
              <button
                type="button"
                className="submit-btn"
                style={{ padding: "0.3rem 0.75rem", fontSize: "0.82rem" }}
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? "Downloading…" : `Download ${submission.fileName || "file"}`}
              </button>
            </div>
          )}
        </section>

        <section className="eval-panel">
          <header className="eval-panel-head">
            <h3 style={{ margin: 0 }}>{isGraded ? "Grade (editable)" : "Grading"}</h3>
            {isGraded && (
              <span className="sub-pill sub-pill-graded is-selected">
                {submission.marksObtained}/{submission.maxMarks}
              </span>
            )}
          </header>

          <form onSubmit={handleSubmit} className="page-form" style={{ padding: 0, boxShadow: "none", border: "none" }}>
            <div className="form-group">
              <label>Marks Obtained</label>
              <input
                type="number"
                min="0"
                value={form.marksObtained}
                onChange={(e) => setForm((f) => ({ ...f, marksObtained: e.target.value }))}
                disabled={saving}
                required
              />
            </div>
            <div className="form-group">
              <label>Max Marks</label>
              <input
                type="number"
                min="1"
                value={form.maxMarks}
                onChange={(e) => setForm((f) => ({ ...f, maxMarks: e.target.value }))}
                disabled={saving}
                required
              />
              {meta.maxMarks != null && (
                <small style={{ color: "#666" }}>
                  Assignment's defined max marks: {meta.maxMarks}
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                rows={4}
                maxLength={500}
                value={form.remarks}
                onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                disabled={saving}
                placeholder="Comments to the student (max 500 chars)"
              />
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? "Saving…" : isGraded ? "Update Grade" : "Submit Grade"}
              </button>
            </div>

            {isGraded && submission.evaluatedBy && (
              <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.6rem" }}>
                Previously graded by {submission.evaluatedBy}
                {submission.evaluatedAt ? ` on ${new Date(submission.evaluatedAt).toLocaleString()}` : ""}.
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
