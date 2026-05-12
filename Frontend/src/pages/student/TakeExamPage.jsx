import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Full-page exam-taking experience.
 *  - Reads the chosen exam from location.state (passed by StudentExamsPage).
 *  - Calls POST /exam/student/start-exam → server returns the in-progress submission with startedAt.
 *  - Renders the question paper inline as a PDF iframe (if attached).
 *  - Counts down based on (startedAt + exam.durationMinutes). Auto-submits at 00:00.
 *  - Student can submit early via the Submit button (text answer, file upload, or both).
 *
 * If the page is loaded directly (refresh / paste URL) without location.state, we send the
 * student back to /student/exams. Refresh-safety would need a "get exam by id" backend endpoint
 * — a follow-up.
 */
export default function TakeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam || null;

  const [starting, setStarting] = useState(true);
  const [startedAt, setStartedAt] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const [answerText, setAnswerText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown
  const [remainingSec, setRemainingSec] = useState(null);
  const autoSubmitFiredRef = useRef(false);

  /* On mount: call start-exam and load the question PDF (if any). */
  useEffect(() => {
    if (!exam) {
      navigate("/student/exams", { replace: true });
      return;
    }
    let revokeUrl = null;
    setStarting(true);
    setError("");

    examApi
      .startExam({ courseCode: exam.courseCode, examType: exam.examType })
      .then((res) => {
        const attempt = res.data?.data || res.data;
        if (!attempt?.startedAt) throw new Error("Server did not return startedAt");
        if (attempt.submittedAt) {
          setSubmitted(true);
          setSuccess("You have already submitted this exam.");
          return null;
        }
        setStartedAt(attempt.startedAt);
        // Fetch the question paper as a blob to render inline (no download dialog)
        if (exam.questionsFileId) {
          return examApi.downloadExamQuestions(exam.id).then((fileRes) => {
            const blob = new Blob([fileRes.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            revokeUrl = url;
            setPdfUrl(url);
          });
        }
        return null;
      })
      .catch((err) => setError(parseApiError(err) || "Failed to start exam."))
      .finally(() => setStarting(false));

    return () => {
      if (revokeUrl) window.URL.revokeObjectURL(revokeUrl);
    };
    // exam.id, exam.courseCode, exam.examType are stable for the page's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  /** Submit handler — wrapped in useCallback so the auto-submit effect can depend on a stable ref. */
  const submitNow = useCallback(
    async ({ auto = false } = {}) => {
      if (!exam || submitting || submitted) return;
      if (!auto && !answerText.trim()) {
        setError("Type your answer before submitting.");
        return;
      }
      setSubmitting(true);
      setError("");
      try {
        // Auto-submit with empty answer falls back to a sentinel so the backend doesn't reject
        const content = answerText.trim() || (auto ? "(time expired — no answer submitted)" : "");
        await examApi.submitExam({
          courseCode: exam.courseCode,
          examType: exam.examType,
          submissionContent: content,
        });
        setSubmitted(true);
        setSuccess(auto ? "Time's up — your exam was submitted automatically." : "Exam submitted.");
      } catch (err) {
        setError(parseApiError(err) || "Submit failed.");
      } finally {
        setSubmitting(false);
      }
    },
    [exam, answerText, submitting, submitted]
  );

  /* Countdown tick. Computes deadline from server startedAt + durationMinutes. */
  useEffect(() => {
    if (!startedAt || !exam?.durationMinutes || submitted) {
      setRemainingSec(null);
      return;
    }
    const startMs = new Date(startedAt).getTime();
    const deadlineMs = startMs + Number(exam.durationMinutes) * 60_000;
    const tick = () => {
      const left = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));
      setRemainingSec(left);
      if (left === 0 && !autoSubmitFiredRef.current) {
        autoSubmitFiredRef.current = true;
        submitNow({ auto: true });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, exam?.durationMinutes, submitted, submitNow]);

  if (!exam) return null;
  if (starting) return <Spinner />;

  if (submitted) {
    return (
      <div>
        <SectionHeader title={exam.examTitle || "Exam"} subtitle={`${exam.courseCode} · ${exam.examType}`} />
        <AlertBanner type="success" message={success} onClose={() => {}} />
        <div className="empty-state">
          <p>Submitted. You can leave this page.</p>
          <button type="button" className="submit-btn" onClick={() => navigate("/student/exams")}>
            Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const timerLabel = formatTimer(remainingSec);
  const timerDanger = remainingSec !== null && remainingSec <= 60;

  return (
    <div className="take-exam-page">
      <div className="take-exam-header">
        <div>
          <h2 style={{ margin: 0 }}>{exam.examTitle}</h2>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.9rem" }}>
            {exam.courseCode} · {exam.examType} · {exam.totalMarks} marks
          </p>
        </div>
        <div className={`exam-timer${timerDanger ? " is-danger" : ""}`} role="timer" aria-live="polite">
          {remainingSec === null ? (
            <span title="No time limit on this exam">No time limit</span>
          ) : (
            <>
              <span className="exam-timer-label">Time remaining</span>
              <span className="exam-timer-value">{timerLabel}</span>
            </>
          )}
        </div>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="take-exam-body">
        {/* LEFT: question paper */}
        <section className="take-exam-questions">
          <h3 style={{ marginTop: 0 }}>Questions</h3>
          {exam.questionsFileId ? (
            pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Question Paper"
                style={{ width: "100%", height: "70vh", border: "1px solid #e5e7eb", borderRadius: "6px" }}
              />
            ) : (
              <p className="muted">Loading question paper…</p>
            )
          ) : (
            <p className="muted">
              The teacher didn't attach a question file for this exam. Refer to instructions provided separately.
            </p>
          )}
        </section>

        {/* RIGHT: answer */}
        <section className="take-exam-answer">
          <h3 style={{ marginTop: 0 }}>Your Answer</h3>
          <div className="form-group">
            <label>Type your answer</label>
            <textarea
              rows={14}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here…"
              disabled={submitting}
            />
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              className="submit-btn"
              onClick={() => submitNow()}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit Exam"}
            </button>
            <button
              type="button"
              className="submit-btn secondary"
              onClick={() => {
                if (window.confirm("Leave without submitting? Your timer keeps running on the server.")) {
                  navigate("/student/exams");
                }
              }}
              disabled={submitting}
            >
              Leave (don't submit)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function formatTimer(sec) {
  if (sec === null || sec === undefined) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
