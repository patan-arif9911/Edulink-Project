import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseApi from "../../api/courseApi";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function ViewSubmissionsPage() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [examSubmissions, setExamSubmissions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseCode) return;

    setLoading(true);
    setError("");

    Promise.all([
      courseApi.fetchSubmissions(courseCode).catch(() => ({ data: [] })),
      examApi.fetchExamsByCourseCode(courseCode).catch(() => ({ data: [] }))
    ])
      .then(([assignmentRes, examsRes]) => {
        const assignmentData = assignmentRes.data?.data || assignmentRes.data || [];
        const examsData = examsRes.data?.data || examsRes.data || [];

        setAssignmentSubmissions(Array.isArray(assignmentData) ? assignmentData : []);
        setExams(Array.isArray(examsData) ? examsData : []);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [courseCode]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await courseApi.downloadSubmission(fileId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || fileId);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + parseApiError(err));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title={`Submissions — ${courseCode}`}
        subtitle="View student submissions for assignments and exams"
      />

      <button
        className="submit-btn"
        style={{ marginBottom: "1rem", background: "#6c757d" }}
        onClick={() => navigate("/teacher/submissions")}
      >
        ← Back to Courses
      </button>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #e0e0e0" }}>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "assignments" ? "bold" : "normal",
            color: activeTab === "assignments" ? "#4361ee" : "#666",
            borderBottom: activeTab === "assignments" ? "3px solid #4361ee" : "none",
            marginBottom: "-2px",
          }}
          onClick={() => setActiveTab("assignments")}
        >
          <span className="material-icons-round" style={{ verticalAlign: "middle", marginRight: "0.5rem" }}>
            assignment
          </span>
          Assignments ({assignmentSubmissions.length})
        </button>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "exams" ? "bold" : "normal",
            color: activeTab === "exams" ? "#4361ee" : "#666",
            borderBottom: activeTab === "exams" ? "3px solid #4361ee" : "none",
            marginBottom: "-2px",
          }}
          onClick={() => setActiveTab("exams")}
        >
          <span className="material-icons-round" style={{ verticalAlign: "middle", marginRight: "0.5rem" }}>
            quiz
          </span>
          Exams ({exams.length})
        </button>
      </div>

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <>
          {assignmentSubmissions.length === 0 && !error ? (
            <div className="empty-state">
              <span className="material-icons-round" style={{ fontSize: 48, color: "#ccc" }}>
                inbox
              </span>
              <p>No assignment submissions yet for this course.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Assignment #</th>
                    <th>Title</th>
                    <th>Student ID</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                    <th>Content</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {assignmentSubmissions.map((s, i) => (
                    <tr key={s.id || i}>
                      <td>{i + 1}</td>
                      <td>{s.assignmentNum ?? "—"}</td>
                      <td>{s.assignmentTitle || "—"}</td>
                      <td>{s.studentId ?? "—"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            s.status === "SUBMITTED" ? "active" : "inactive"
                          }`}
                        >
                          {s.status || "—"}
                        </span>
                      </td>
                      <td>
                        {s.submittedAt
                          ? new Date(s.submittedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.submissionContent || "—"}
                      </td>
                      <td>
                        {s.fileId ? (
                          <button
                            className="submit-btn"
                            style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                            onClick={() => handleDownload(s.fileId, s.fileName)}
                          >
                            📥 Download
                          </button>
                        ) : (
                          <span style={{ color: "#999" }}>No file</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Exams Tab */}
      {activeTab === "exams" && (
        <>
          {exams.length === 0 && !error ? (
            <div className="empty-state">
              <span className="material-icons-round" style={{ fontSize: 48, color: "#ccc" }}>
                quiz
              </span>
              <p>No exams created yet for this course.</p>
            </div>
          ) : (
            <div className="card-grid">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="metric-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/teacher/exam-submissions/${courseCode}`)}
                >
                  <span className="material-icons-round" style={{ fontSize: 36, color: "#ff006e" }}>
                    quiz
                  </span>
                  <h4 style={{ margin: "0.5rem 0 0.25rem" }}>{exam.examTitle || "Exam"}</h4>
                  <p style={{ color: "#666", fontSize: "0.85rem" }}>
                    {exam.examType || "Exam"} | {exam.totalMarks || 0} marks
                  </p>
                  <p style={{ color: "#999", fontSize: "0.75rem" }}>
                    {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "Date not set"}
                  </p>
                  <span style={{ color: "#ff006e", fontSize: "0.8rem" }}>View Submissions →</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
