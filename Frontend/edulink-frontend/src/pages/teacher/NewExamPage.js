import React, { useState } from "react";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function NewExamPage() {
  const [courseCode, setCourseCode] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("MIDTERM");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const formData = new FormData();
    formData.append("courseCode", courseCode);
    formData.append("examTitle", examTitle);
    formData.append("examType", examType);
    formData.append("totalMarks", totalMarks);
    formData.append("passingMarks", passingMarks);
    formData.append("schoolId", schoolId);
    if (examDate) formData.append("examDate", examDate + "T09:00:00");
    if (file) formData.append("questionsFile", file);

    setLoading(true);
    try {
      await examApi.createExam(formData);
      setSuccess("Exam created successfully!");
      setCourseCode(""); setExamTitle(""); setTotalMarks(""); setPassingMarks(""); setSchoolId(""); setExamDate(""); setFile(null);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="New Exam" subtitle="POST /teacher/create-exam" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required disabled={loading} placeholder="MATH101" />
          </div>
          <div className="form-group">
            <label>Exam Title</label>
            <input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Exam Type</label>
            <select value={examType} onChange={(e) => setExamType(e.target.value)} disabled={loading}>
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
            </select>
          </div>
          <div className="form-group">
            <label>Total Marks</label>
            <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Passing Marks</label>
            <input type="number" value={passingMarks} onChange={(e) => setPassingMarks(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>School ID</label>
            <input value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required disabled={loading} placeholder="SCH001" />
          </div>
          <div className="form-group">
            <label>Exam Date</label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Questions File (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Exam"}</button>
        </form>
      </div>
    </div>
  );
}
