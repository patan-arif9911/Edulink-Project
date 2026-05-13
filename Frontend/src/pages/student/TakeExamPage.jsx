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
 *  - Reads the chosen exam from location.state.
 *  - Calls /exam/student/start-exam → returns the in-progress submission (with startedAt).
 *  - Renders the question paper inline as a PDF iframe (if attached).
 *  - Counts down based on (startedAt + exam.durationMinutes).
 *  - Auto-submit fires only if the deadline is reached IN-SESSION, not when the page loads
 *    with an already-expired startedAt from a previous incomplete attempt.
 */
export default function TakeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam || null;

  const [starting, setStarting] = useState(true);
  const [startedAt, setStartedAt] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("questions.pdf");
  const [pdfError, setPdfError] = useState("");

  const [answerText, setAnswerText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmittedBefore, setAlreadySubmittedBefore] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown
  const [remainingSec, setRemainingSec] = useState(null);
  const autoSubmitFiredRef = useRef(false);
  // Captured ONCE on page load — used to detect "stale" attempts where startedAt is from a
  // previous session and the deadline has already passed. We refuse to auto-submit in that case.
  const pageLoadTimeRef = useRef(Date.now());

  /* On mount: call start-exam and load the question PDF (if any). */
  useEffect(() => {
    if (!exam) {
      navigate("/student/exams", { replace: true });
      return;
    }
    let revokeUrl = null;
    setStarting(true);
    setError("");
    setPdfError("");

    examApi
      .startExam({ courseCode: exam.courseCode, examType: exam.examType })
      .then((res) => {
        const attempt = res.data?.data || res.data;
        // eslint-disable-next-line no-console
        console.info("[TakeExam] startExam response:", attempt);

        if (!attempt?.startedAt) {
          throw new Error("Server didn't return startedAt — refresh and try again");
        }
        if (attempt.submittedAt) {
          // Backend should throw before reaching this case (latest service code does);
          // this defensive branch covers any stale data path that slips through.
          setAlreadySubmittedBefore(true);
          setSubmitted(true);
          setSuccess("You already submitted this exam.");
          return null;
        }
        setStartedAt(attempt.startedAt);

        if (exam.questionsFileId) {
          return examApi
            .downloadExamQuestions(exam.id)
            .then((fileRes) => {
              const blob = new Blob([fileRes.data], { type: "application/pdf" });
              const url = window.URL.createObjectURL(blob);
              revokeUrl = url;
              setPdfUrl(url);
              // Try to derive a friendlier filename from Content-Disposition (mirrors materials flow)
              const dispo = fileRes.headers?.["content-disposition"] || "";
              const match = /filename="([^"]+)"/.exec(dispo);
              if (match) setPdfFileName(match[1]);
              else setPdfFileName(`${exam.examTitle || "questions"}.pdf`);
            })
            .catch((dlErr) => {
              // Surface the download failure but DON'T block the exam — student can still type
              setPdfError(parseApiError(dlErr) || "Couldn't load the question paper.");
            });
        }
        return null;
      })
      .catch((err) => {
        const parsed = parseApiError(err) || "";
        if (parsed.toLowerCase().includes("already submitted")) {
          setAlreadySubmittedBefore(true);
          setSubmitted(true);
          setSuccess("You already submitted this exam.");
        } else {
          setError(parsed || "Failed to start exam.");
        }
      })
      .finally(() => setStarting(false));

    return () => {
      if (revokeUrl) window.URL.revokeObjectURL(revokeUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  /** Submit handler. The `auto` flag prevents the empty-answer guard from blocking time-expiry submits. */
  const submitNow = useCallback(
    async ({ auto = false } = {}) => {
      if (!exam || submitting || submitted) return;
      if (!auto && !answerText.trim()) {
        setError("Type your answer before submitting.");
        return;
      }
      if (!auto) {
        const ok = window.confirm(
          "Submit your answer? You can't change it after submitting."
        );
        if (!ok) return;
      }
      setSubmitting(true);
      setError("");
      try {
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

  /* Countdown tick — runs only when we have both a startedAt AND durationMinutes. */
  useEffect(() => {
    if (!startedAt || !exam?.durationMinutes || submitted) {
      setRemainingSec(null);
      return;
    }
    const startMs = new Date(startedAt).getTime();
    const deadlineMs = startMs + Number(exam.durationMinutes) * 60_000;

    // STALE-ATTEMPT GUARD: if the deadline was already past when the page loaded, the student
    // never got a chance to answer this attempt. Don't auto-submit — show the timer at 0 and
    // require a manual submit. Prevents the "I just opened the page and it submitted itself" bug.
    const isStaleAttempt = deadlineMs <= pageLoadTimeRef.current;

    const tick = () => {
      const left = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));
      setRemainingSec(left);
      if (left === 0 && !autoSubmitFiredRef.current && !isStaleAttempt) {
        autoSubmitFiredRef.current = true;
        // eslint-disable-next-line no-console
        console.info("[TakeExam] Timer expired in-session — auto-submitting.");
        submitNow({ auto: true });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, exam?.durationMinutes, submitted, submitNow]);

  if (!exam) return null;
  if (starting) return <Spinner />;

  /* Submitted (final) state — covers both fresh-submit and already-submitted-before. */
  if (submitted) {
    return (
      <div>
        <SectionHeader title={exam.examTitle || "Exam"} subtitle={`${exam.courseCode} · ${exam.examType}`} />
        <AlertBanner type="success" message={success} onClose={() => {}} />
        <div className="empty-state">
          <p>
            {alreadySubmittedBefore
              ? "You have already submitted this exam. Only one attempt per exam is allowed."
              : "Submitted. You can leave this page."}
          </p>
          <button type="button" className="submit-btn" onClick={() => navigate("/student/exams")}>
            Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const timerLabel = formatTimer(remainingSec);
  const timerDanger = remainingSec !== null && remainingSec <= 60;
  const timerExpired = remainingSec === 0;

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
            <span title="No duration set on this exam">No time limit</span>
          ) : (
            <>
              <span className="exam-timer-label">{timerExpired ? "Time expired" : "Time remaining"}</span>
              <span className="exam-timer-value">{timerLabel}</span>
            </>
          )}
        </div>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="take-exam-body">
        {/* LEFT: question paper — mirrors the materials flow with inline view + download + open-in-tab */}
        <section className="take-exam-questions">
          <h3 style={{ marginTop: 0 }}>Questions</h3>
          {!exam.questionsFileId ? (
            <p className="muted">
              The teacher didn't attach a question file for this exam. Refer to instructions provided separately.
            </p>
          ) : pdfError ? (
            <div>
              <p className="muted" style={{ color: "#b45309" }}>{pdfError}</p>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                You can still type your answer on the right.
              </p>
            </div>
          ) : !pdfUrl ? (
            <p className="muted">Loading question paper…</p>
          ) : (
            <>
          
              <object
                data={pdfUrl}
                type="application/pdf"
                style={{ width: "100%", height: "65vh", border: "1px solid #e5e7eb", borderRadius: "6px" }}
              >
                <p className="muted" style={{ padding: "1rem" }}>
                  Your browser can't show the PDF inline. Use the buttons above to open or download it.
                </p>
              </object>
            </>
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
              disabled={submitting || !answerText.trim()}
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
