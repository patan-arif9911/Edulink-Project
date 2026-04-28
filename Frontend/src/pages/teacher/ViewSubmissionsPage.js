import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function ViewSubmissionsPage() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseCode) return;
    courseApi
      .fetchSubmissions(courseCode)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setSubmissions(Array.isArray(data) ? data : []);
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
        subtitle={`${submissions.length} submission(s) found`}
      />

      <button
        className="submit-btn"
        style={{ marginBottom: "1rem", background: "#6c757d" }}
        onClick={() => navigate("/teacher/submissions")}
      >
        ← Back to Courses
      </button>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {submissions.length === 0 && !error ? (
        <div className="empty-state">
          <span className="material-icons-round" style={{ fontSize: 48, color: "#ccc" }}>
            inbox
          </span>
          <p>No submissions yet for this course.</p>
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
              {submissions.map((s, i) => (
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
    </div>
  );
}
