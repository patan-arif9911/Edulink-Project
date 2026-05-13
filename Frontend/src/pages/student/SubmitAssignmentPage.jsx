import React, { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

/**
 * Student-side assignment submission.
 *  - Course dropdown — populated from /student/courses (enrolled courses only)
 *  - Assignment dropdown — populated from /student/assignments/{courseCode} for the chosen course
 *  - assignmentNum + assignmentTitle auto-fill from the selected assignment
 *  - Submission content (text) and / or attachment file
 */
export default function SubmitAssignmentPage() {
  // Course dropdown (cascades from enrolled courses)
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  // Assignment dropdown (cascades from the chosen course)
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState("");

  // Submission fields
  const [submissionContent, setSubmissionContent] = useState("");
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Load enrolled courses on mount. */
  useEffect(() => {
    studentApi
      .fetchEnrolledCourses()
      .then((res) => setCourses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load your courses."))
      .finally(() => setCoursesLoading(false));
  }, []);

  /* When course changes, fetch its assignments and reset the assignment selection. */
  useEffect(() => {
    if (!selectedCourseCode) {
      setAssignments([]);
      setSelectedAssignmentKey("");
      return;
    }
    setAssignmentsLoading(true);
    setSelectedAssignmentKey("");
    studentApi
      .fetchAssignments(selectedCourseCode)
      .then((res) => setAssignments(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load assignments for this course."))
      .finally(() => setAssignmentsLoading(false));
  }, [selectedCourseCode]);

  /* Derived: the assignment object the user picked (key is assignmentNum for stability). */
  const selectedAssignment = assignments.find(
    (a) => String(a.assignmentNum) === selectedAssignmentKey
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCourseCode) { setError("Please select a course."); return; }
    if (!selectedAssignment) { setError("Please select an assignment."); return; }
    if (!submissionContent.trim() && !file) {
      setError("Provide submission text or upload a file (or both).");
      return;
    }

    /* Backend expects multipart/form-data with:
       assignmentNum, courseCode, assignmentTitle, submissionContent?, file? */
    const formData = new FormData();
    formData.append("assignmentNum", Number(selectedAssignment.assignmentNum));
    formData.append("courseCode", selectedCourseCode);
    formData.append("assignmentTitle", selectedAssignment.title || "");
    if (submissionContent.trim()) {
      formData.append("submissionContent", submissionContent.trim());
    }
    if (file) {
      formData.append("file", file);
    }

    setSubmitting(true);
    try {
      const res = await studentApi.uploadSubmission(formData);
      const data = res.data?.data;
      setSuccess(
        `Assignment submitted successfully! Status: ${data?.status || "SUBMITTED"}`
      );
      // Reset only the submission inputs, keep course/assignment selection so the student
      // can immediately verify or resubmit if their school allows it.
      setSubmissionContent("");
      setFile(null);
      const fileInput = document.getElementById("submission-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (coursesLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Submit Assignment"
        subtitle="Pick a course and assignment, then upload your submission"
      />
      <div className="page-form">
        <AlertBanner type="error"   message={error}   onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sub-course">
              Course <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="sub-course"
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              disabled={submitting}
              required
            >
              <option value="">— Select a course —</option>
              {courses.map((c) => (
                <option key={c.courseCode || c.id} value={c.courseCode}>
                  {c.courseName ? `${c.courseName} (${c.courseCode})` : c.courseCode}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <small style={{ color: "#b45309" }}>
                You're not enrolled in any course yet. Enroll first from "Enroll in Course".
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sub-assignment">
              Assignment <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="sub-assignment"
              value={selectedAssignmentKey}
              onChange={(e) => setSelectedAssignmentKey(e.target.value)}
              disabled={submitting || !selectedCourseCode || assignmentsLoading}
              required
            >
              <option value="">
                {!selectedCourseCode
                  ? "— Pick a course first —"
                  : assignmentsLoading
                    ? "Loading…"
                    : assignments.length === 0
                      ? "No assignments for this course yet"
                      : "— Select an assignment —"}
              </option>
              {assignments.map((a) => (
                <option key={a.assignmentNum} value={String(a.assignmentNum)}>
                  #{a.assignmentNum} · {a.title}
                  {a.dueDate ? ` (due ${formatDateTime(a.dueDate)})` : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedAssignment && (
            <div
              style={{
                margin: "0 0 1rem",
                padding: "0.75rem 0.9rem",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            >
              <div><strong>Title:</strong> {selectedAssignment.title}</div>
              {selectedAssignment.description && (
                <div style={{ marginTop: "0.25rem" }}>
                  <strong>Details:</strong> {selectedAssignment.description}
                </div>
              )}
              <div style={{ marginTop: "0.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span><strong>Due:</strong> {selectedAssignment.dueDate ? formatDateTime(selectedAssignment.dueDate) : "—"}</span>
                <span><strong>Max Marks:</strong> {selectedAssignment.maxMarks ?? "—"}</span>
                <span><strong>Assignment #:</strong> {selectedAssignment.assignmentNum}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="sub-content">Submission Text</label>
            <textarea
              id="sub-content"
              rows={5}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              disabled={submitting}
              placeholder="Type your answer here…"
            />
          </div>

          <div className="form-group">
            <label htmlFor="submission-file">Attachment(optional)</label>
            <input
              id="submission-file"
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              disabled={submitting}
            />
            <small style={{ color: "#666" }}>
              At least one of text content or file must be provided.
            </small>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting || !selectedAssignment}>
            {submitting ? "Submitting…" : "Submit Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
