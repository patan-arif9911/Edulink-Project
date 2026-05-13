import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Lists every exam the teacher has created, grouped by courseCode for readability.
 * Note: classes (grade+section) and courses (courseCode) are unrelated entities here,
 * so we browse exams directly, not via a class accordion.
 */
export default function ExamSubmissionsBrowserPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExams = () => {
    setLoading(true);
    setError("");
    examApi
      .fetchTeacherExams()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setExams(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load your exams."))
      .finally(() => setLoading(false));
  };

  useEffect(loadExams, []);

  /** Group exams by courseCode so the page reads like "Course → its exams". */
  const grouped = useMemo(() => {
    const map = new Map();
    exams.forEach((exam) => {
      const key = exam.courseCode || "(unknown course)";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(exam);
    });
    // Sort exams within each group by examDate desc (most recent first)
    map.forEach((list) =>
      list.sort((a, b) =>
        String(b.examDate || "").localeCompare(String(a.examDate || ""))
      )
    );
    return Array.from(map.entries());
  }, [exams]);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Exam Submissions"
        subtitle="Pick an exam to view who has submitted and grade their work."
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="sub-toolbar">
        <button type="button" className="submit-btn" onClick={loadExams}>Refresh</button>
        <div className="sub-counts">
          <span className="sub-pill sub-pill-graded is-selected">
            {exams.length} exam{exams.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any exams yet.</p>
          <button type="button" className="submit-btn" onClick={() => navigate("/teacher/new-exam")}>
            Create your first exam
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {grouped.map(([courseCode, courseExams]) => (
            <section key={courseCode} className="exam-course-group">
              <header className="exam-course-head">
                <h3 style={{ margin: 0 }}>{courseCode}</h3>
                <span className="muted">
                  {courseExams.length} exam{courseExams.length === 1 ? "" : "s"}
                </span>
              </header>

              <div className="att-table-wrap">
                <table className="att-table">
                  <thead>
                    <tr>
                      <th>Exam Title</th>
                      <th>Type</th>
                      <th>Total Marks</th>
                      <th>Exam Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseExams.map((exam) => (
                      <tr key={exam.id}>
                        <td>{exam.examTitle || "—"}</td>
                        <td>{exam.examType || "—"}</td>
                        <td>{exam.totalMarks ?? "—"}</td>
                        <td>{exam.examDate ? new Date(exam.examDate).toLocaleString() : "—"}</td>
                        <td>
                          <button
                            type="button"
                            className="link-btn"
                            onClick={() =>
                              navigate(
                                `/teacher/exam-submissions/${encodeURIComponent(courseCode)}/${encodeURIComponent(exam.examType || "")}`,
                                {
                                  state: {
                                    examTitle: exam.examTitle,
                                    examDate: exam.examDate,
                                    totalMarks: exam.totalMarks,
                                    passingMarks: exam.passingMarks,
                                  },
                                }
                              )
                            }
                          >
                            View Submissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
