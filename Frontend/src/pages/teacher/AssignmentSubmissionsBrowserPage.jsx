import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Lists every assignment the teacher has created, grouped by courseCode.
 * Mirrors the ExamSubmissionsBrowserPage layout. Click an assignment → see its submissions.
 */
export default function AssignmentSubmissionsBrowserPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = () => {
    setLoading(true);
    setError("");
    courseApi
      .fetchTeacherAssignments()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setAssignments(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load your assignments."))
      .finally(() => setLoading(false));
  };

  useEffect(loadAssignments, []);

  /** Group by courseCode, sort within each group by assignmentNum desc. */
  const grouped = useMemo(() => {
    const map = new Map();
    assignments.forEach((a) => {
      const key = a.courseCode || "(unknown course)";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    });
    map.forEach((list) =>
      list.sort((a, b) => (b.assignmentNum || 0) - (a.assignmentNum || 0))
    );
    return Array.from(map.entries());
  }, [assignments]);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Assignment Submissions"
        subtitle="Pick an assignment to view who has submitted."
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="sub-toolbar">
        <button type="button" className="submit-btn" onClick={loadAssignments}>Refresh</button>
        <div className="sub-counts">
          <span className="sub-pill sub-pill-graded is-selected">
            {assignments.length} assignment{assignments.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any assignments yet.</p>
          <button type="button" className="submit-btn" onClick={() => navigate("/teacher/new-assignment")}>
            Create your first assignment
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {grouped.map(([courseCode, courseAssignments]) => (
            <section key={courseCode} className="exam-course-group">
              <header className="exam-course-head">
                <h3 style={{ margin: 0 }}>{courseCode}</h3>
                <span className="muted">
                  {courseAssignments.length} assignment{courseAssignments.length === 1 ? "" : "s"}
                </span>
              </header>

              <div className="att-table-wrap">
                <table className="att-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Due Date</th>
                      <th>Max Marks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseAssignments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.assignmentNum ?? "—"}</td>
                        <td>{a.title || "—"}</td>
                        <td>{a.dueDate ? new Date(a.dueDate).toLocaleString() : "—"}</td>
                        <td>{a.maxMarks ?? "—"}</td>
                        <td>
                          <button
                            type="button"
                            className="link-btn"
                            onClick={() =>
                              navigate(
                                `/teacher/assignment-submissions/${encodeURIComponent(courseCode)}/${a.assignmentNum}`,
                                {
                                  state: {
                                    title: a.title,
                                    description: a.description,
                                    dueDate: a.dueDate,
                                    maxMarks: a.maxMarks,
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
