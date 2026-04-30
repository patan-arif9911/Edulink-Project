import React, { useState } from "react";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function GradeStudentPage() {
  const [form, setForm] = useState({
    courseCode: "",
    examType: "",
    rollNumber: "",
    marksObtained: "",
    totalMarks: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await examApi.gradeStudent({
        ...form,
        marksObtained: Number(form.marksObtained),
        totalMarks: Number(form.totalMarks),
      });
      setSuccess("Grade recorded successfully!");
      setForm({ courseCode: "", examType: "", rollNumber: "", marksObtained: "", totalMarks: "", remarks: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Grade Student" subtitle="POST /teacher/grade-student" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} required disabled={loading} placeholder="e.g. MATH101" />
          </div>
          <div className="form-group">
            <label>Exam Type</label>
            <select value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })} required disabled={loading}>
              <option value="">— Select —</option>
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Student Roll Number</label>
            <input value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required disabled={loading} placeholder="e.g. SCH001101" />
          </div>
          <div className="form-group">
            <label>Marks Obtained</label>
            <input type="number" value={form.marksObtained} onChange={(e) => setForm({ ...form, marksObtained: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Total Marks</label>
            <input type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Grading…" : "Submit Grade"}</button>
        </form>
      </div>
    </div>
  );
}
