import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Contextual grade page. Loaded from the per-exam roster's "View Submission" button.
 * Shows the student's submission and lets the teacher enter marks + feedback.
 * If the student is already graded, the page renders in read-only mode (gradeStudent rejects duplicates).
 */
export default function EvaluateSubmissionPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fields carried in navigation state from the roster page. Re-fetched as a fallback if missing.
  const passed = location.state || {};

  const [submission, setSubmission] = useState(null);
  const [existingGrade, setExistingGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    marksObtained: "",
    totalMarks: passed.examMeta?.totalMarks ?? "",
    passingMarks: passed.examMeta?.passingMarks ?? "",
    remarks: "",
  });

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    setError("");
    examApi
      .fetchSubmissionById(submissionId)
      .then(async (res) => {
        const sub = res.data?.data || res.data;
        setSubmission(sub);
        // After loading the submission, check if a grade already exists for this student/exam
        try {
          const gradesRes = await examApi.fetchGradesByExam({
            courseCode: sub.courseCode,
            examType: sub.examType,
          });
          const list = gradesRes.data?.data || gradesRes.data || [];
          const mine = list.find((g) => g.rollNumber === sub.rollNumber);
          if (mine) {
            setExistingGrade(mine);
            setForm({
              marksObtained: String(mine.marksObtained ?? ""),
              totalMarks: String(mine.totalMarks ?? form.totalMarks ?? ""),
              passingMarks: String(mine.passingMarks ?? form.passingMarks ?? ""),
              remarks: mine.remarks || "",
            });
          }
        } catch {
          // Ignore — read-only check, don't block the page
        }
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load submission."))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (existingGrade) {
      setError("This student has already been graded for this exam.");
      return;
    }
    const marks = Number(form.marksObtained);
    const total = Number(form.totalMarks);
    if (Number.isNaN(marks) || marks < 0) { setError("Enter a valid marks obtained."); return; }
    if (Number.isNaN(total) || total <= 0) { setError("Total marks must be greater than zero."); return; }
    if (marks > total) { setError("Marks obtained cannot exceed total marks."); return; }
    if ((form.remarks || "").length > 500) { setError("Feedback must be 500 characters or fewer."); return; }

    setSaving(true);
    try {
      const payload = {
        courseCode: submission.courseCode,
        examType: submission.examType,
        rollNumber: submission.rollNumber,
        studentEmail: submission.studentEmail,
        marksObtained: marks,
        totalMarks: total,
        passingMarks: form.passingMarks ? Number(form.passingMarks) : 0,
        remarks: form.remarks,
      };
      const res = await examApi.gradeStudent(payload);
      const saved = res.data?.data || res.data;
      setExistingGrade(saved);
      setSuccess(`Saved. Auto-assigned grade: ${saved?.grade || "—"}.`);
    } catch (err) {
      setError(parseApiError(err) || "Failed to save evaluation.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!submission) {
    return (
      <div>
        <SectionHeader title="Evaluate Submission" />
        <AlertBanner type="error" message={error || "Submission not found."} />
        <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const studentName = passed.studentName || submission.rollNumber;
  const lateFlag = submission.isLate ? <span className="sub-late-tag">Late</span> : null;

  return (
    <div>
      <SectionHeader
        title={`Evaluate: ${studentName}`}
        subtitle={`${submission.courseCode} · ${submission.examType} · submitted ${new Date(submission.submittedAt).toLocaleString()}`}
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
            <div><dt>Roll No</dt><dd>{submission.rollNumber}</dd></div>
            <div><dt>Email</dt><dd>{submission.studentEmail}</dd></div>
            <div><dt>Course</dt><dd>{submission.courseCode}</dd></div>
            <div><dt>Type</dt><dd>{submission.examType}</dd></div>
          </dl>
          <h4 style={{ marginBottom: "0.4rem" }}>Answer</h4>
          <pre className="eval-answer">
            {submission.submissionContent || "(no text content)"}
          </pre>
          {submission.submissionFileId && (
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              File attachment ID: {submission.submissionFileId} (download not yet wired in this view)
            </p>
          )}
        </section>

        <section className="eval-panel">
          <header className="eval-panel-head">
            <h3 style={{ margin: 0 }}>{existingGrade ? "Existing Grade" : "Grading"}</h3>
            {existingGrade && (
              <span className="sub-pill sub-pill-graded is-selected">{existingGrade.grade || "Graded"}</span>
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
                disabled={saving || !!existingGrade}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Marks</label>
              <input
                type="number"
                min="1"
                value={form.totalMarks}
                onChange={(e) => setForm((f) => ({ ...f, totalMarks: e.target.value }))}
                disabled={saving || !!existingGrade}
                required
              />
            </div>
            <div className="form-group">
              <label>Passing Marks (optional)</label>
              <input
                type="number"
                min="0"
                value={form.passingMarks}
                onChange={(e) => setForm((f) => ({ ...f, passingMarks: e.target.value }))}
                disabled={saving || !!existingGrade}
                placeholder="Defaults to 40% of total"
              />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                rows={4}
                maxLength={500}
                value={form.remarks}
                onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                disabled={saving || !!existingGrade}
                placeholder="Comments to the student (max 500 chars)"
              />
            </div>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button type="button" className="submit-btn secondary" onClick={() => navigate(-1)}>← Back</button>
              <button type="submit" className="submit-btn" disabled={saving || !!existingGrade}>
                {existingGrade ? "Already Graded" : saving ? "Saving…" : "Submit Evaluation"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
