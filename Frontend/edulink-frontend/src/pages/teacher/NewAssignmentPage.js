import React, { useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function NewAssignmentPage() {
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [assignmentNum, setAssignmentNum] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const formData = new FormData();
    formData.append("courseCode", courseCode);
    formData.append("title", title);
    formData.append("description", description);
    if (dueDate) formData.append("dueDate", dueDate + "T23:59:59");
    if (maxMarks) formData.append("maxMarks", maxMarks);
    if (assignmentNum) formData.append("assignmentNum", assignmentNum);
    if (file) formData.append("questionsFile", file);

    setLoading(true);
    try {
      await courseApi.createAssignment(formData);
      setSuccess("Assignment created successfully!");
      setCourseCode(""); setTitle(""); setDescription(""); setDueDate(""); setMaxMarks(""); setAssignmentNum(""); setFile(null);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="New Assignment" subtitle="POST /teacher/create-assignment" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required disabled={loading} placeholder="MATH101" />
          </div>
          <div className="form-group">
            <label>Assignment Number</label>
            <input type="number" value={assignmentNum} onChange={(e) => setAssignmentNum(e.target.value)} required disabled={loading} placeholder="1" />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Max Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Questions File (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Assignment"}</button>
        </form>
      </div>
    </div>
  );
}
