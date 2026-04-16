import React, { useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function AddClassPage() {
  const [form, setForm] = useState({ className: "", grade: "", section: "", schoolId: "", teacherEmail: "", courseId: "", capacity: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await courseApi.createClass({ ...form, courseId: Number(form.courseId) || null, capacity: Number(form.capacity) || 0 });
      setSuccess(`Class "${form.className}" created successfully!`);
      setForm({ className: "", grade: "", section: "", schoolId: "", teacherEmail: "", courseId: "", capacity: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Create Class" subtitle="POST /course/admin/create-class" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class Name</label>
            <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} required disabled={loading} placeholder="10A Mathematics" />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required disabled={loading} placeholder="Grade 10" />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} required disabled={loading} placeholder="A" />
          </div>
          <div className="form-group">
            <label>School ID</label>
            <input value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required disabled={loading} placeholder="SCH001" />
          </div>
          <div className="form-group">
            <label>Teacher Email</label>
            <input type="email" value={form.teacherEmail} onChange={(e) => setForm({ ...form, teacherEmail: e.target.value })} required disabled={loading} placeholder="teacher@school.edu" />
          </div>
          <div className="form-group">
            <label>Course ID</label>
            <input type="number" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required disabled={loading} placeholder="1" />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required disabled={loading} placeholder="35" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Class"}</button>
        </form>
      </div>
    </div>
  );
}
