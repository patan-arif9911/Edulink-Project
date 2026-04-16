import React, { useState } from "react";
import attendanceApi from "../../api/attendanceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function RecordAttendancePage() {
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    schoolId: "",
    attendanceDate: new Date().toISOString().split("T")[0],
    status: "PRESENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await attendanceApi.markAttendance({
        ...form,
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
      });
      setSuccess("Attendance recorded!");
      setForm({ ...form, studentId: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Mark Attendance" subtitle="POST /teacher/mark-attendance" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID</label>
            <input type="number" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Course ID</label>
            <input type="number" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>School ID</label>
            <input value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.attendanceDate} onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} disabled={loading}>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Recording…" : "Mark Attendance"}</button>
        </form>
      </div>
    </div>
  );
}
