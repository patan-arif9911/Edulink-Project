import React, { useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function AddCoursePage() {
  const [form, setForm] = useState({ courseCode: "", courseName: "", description: "", schoolId: "", subject: "", grade: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await courseApi.createCourse(form);
      setSuccess(`Course "${form.courseName}" created successfully!`);
      setForm({ courseCode: "", courseName: "", description: "", schoolId: "", subject: "", grade: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Create Course" subtitle="POST course/admin/create-course" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} required disabled={loading} placeholder="MATH101" />
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} required disabled={loading} placeholder="Mathematics" />
          </div>
          <div className="form-group">
            <label>School ID</label>
            <input value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required disabled={loading} placeholder="SCH001" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required disabled={loading} placeholder="Mathematics" />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required disabled={loading} placeholder="10" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Course"}</button>
        </form>
      </div>
    </div>
  );
}
