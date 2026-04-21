import React, { useState } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function SubmitAssignmentPage() {
  const [courseCode, setCourseCode] = useState("");
  const [assignmentNum, setAssignmentNum] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionContent, setSubmissionContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!courseCode.trim()) return "Course code is required.";
    if (!assignmentNum || Number(assignmentNum) < 1)
      return "Assignment number must be at least 1.";
    if (!assignmentTitle.trim()) return "Assignment title is required.";
    if (!submissionContent.trim() && !file)
      return "Please provide either text content or upload a file (or both).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    /* Backend expects multipart/form-data with fields:
       assignmentNum (int), courseCode (string), assignmentTitle (string),
       submissionContent? (string), file? (MultipartFile) */
    const formData = new FormData();
    formData.append("assignmentNum", Number(assignmentNum));
    formData.append("courseCode", courseCode.trim().toUpperCase());
    formData.append("assignmentTitle", assignmentTitle.trim());
    if (submissionContent.trim()) {
      formData.append("submissionContent", submissionContent.trim());
    }
    if (file) {
      formData.append("file", file);
    }

    setLoading(true);
    try {
      const res = await studentApi.uploadSubmission(formData);
      const data = res.data?.data;
      setSuccess(
        `Assignment submitted successfully! Status: ${data?.status || "SUBMITTED"}`
      );
      setCourseCode("");
      setAssignmentNum("");
      setAssignmentTitle("");
      setSubmissionContent("");
      setFile(null);
      /* Reset the file input */
      const fileInput = document.getElementById("submission-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Submit Assignment"
        subtitle="Upload your assignment submission"
      />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sub-course">
              Course Code <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="sub-course"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. MATH101"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sub-num">
              Assignment Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="sub-num"
              type="number"
              min="1"
              value={assignmentNum}
              onChange={(e) => setAssignmentNum(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sub-title">
              Assignment Title <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="sub-title"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. Homework 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sub-content">Submission Text (optional)</label>
            <textarea
              id="sub-content"
              rows={5}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              disabled={loading}
              placeholder="Type your answer here…"
            />
          </div>

          <div className="form-group">
            <label htmlFor="submission-file">Attachment (optional)</label>
            <input
              id="submission-file"
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              disabled={loading}
            />
            <small style={{ color: "#666" }}>
              At least one of text content or file must be provided.
            </small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting…" : "Submit Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
