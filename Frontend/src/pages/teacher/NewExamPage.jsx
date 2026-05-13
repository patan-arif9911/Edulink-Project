import React, { useEffect, useState } from "react";
import examApi from "../../api/examApi";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function NewExamPage() {
  // Cascading dropdowns: class → course
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  // The rest of the exam fields
  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("MIDTERM");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [examDate, setExamDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Load the teacher's classes once on mount. */
  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load classes."))
      .finally(() => setClassesLoading(false));
  }, []);

  /* When a class is selected, fetch its courses. Reset the previously selected course. */
  useEffect(() => {
    if (!selectedClassId) {
      setCourses([]);
      setSelectedCourseCode("");
      return;
    }
    setCoursesLoading(true);
    setSelectedCourseCode("");
    courseApi
      .fetchCoursesByClass(selectedClassId)
      .then((res) => setCourses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load courses for this class."))
      .finally(() => setCoursesLoading(false));
  }, [selectedClassId]);

  const selectedClass = classes.find((c) => String(c.id || c.classId) === selectedClassId);
  const selectedCourse = courses.find((c) => c.courseCode === selectedCourseCode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedClassId) { setError("Please select a class."); return; }
    if (!selectedCourseCode) { setError("Please select a course."); return; }

    const formData = new FormData();
    formData.append("courseCode", selectedCourseCode);
    formData.append("examTitle", examTitle);
    formData.append("examType", examType);
    formData.append("totalMarks", totalMarks);
    formData.append("passingMarks", passingMarks);
    formData.append("schoolId", selectedClass?.schoolId || selectedCourse?.schoolId || "");
    if (examDate) formData.append("examDate", examDate + "T09:00:00");
    if (durationMinutes) formData.append("durationMinutes", durationMinutes);
    if (file) formData.append("questionsFile", file);

    setLoading(true);
    try {
      await examApi.createExam(formData);
      setSuccess(`Exam created for ${selectedCourse?.courseName || selectedCourseCode} in ${selectedClass?.className || ""}.`);
      // Reset the exam-specific fields but keep the class/course selection so the teacher
      // can quickly create another exam for the same course.
      setExamTitle("");
      setTotalMarks("");
      setPassingMarks("");
      setExamDate("");
      setDurationMinutes("60");
      setFile(null);
      const fileInput = document.getElementById("exam-questions-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (classesLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="New Exam" subtitle="Select a class and course, then enter exam details" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">— Select a class —</option>
              {classes.map((c) => (
                <option key={c.id || c.classId} value={c.id || c.classId}>
                  {c.className || `Class ${c.grade || ""}${c.section || ""}`}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <small style={{ color: "#b45309" }}>
                You aren't assigned to any classes yet. Ask your school admin to assign you.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Course</label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              disabled={loading || !selectedClassId || coursesLoading}
              required
            >
              <option value="">
                {!selectedClassId
                  ? "— Select a class first —"
                  : coursesLoading
                    ? "Loading…"
                    : courses.length === 0
                      ? "No courses for this class"
                      : "— Select a course —"}
              </option>
              {courses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseName ? `${c.courseName} (${c.courseCode})` : c.courseCode}
                </option>
              ))}
            </select>
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
            <label>Exam Date</label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="600"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              disabled={loading}
              placeholder="60"
            />
            <small style={{ color: "#666" }}>
              How long the student has to complete the exam once they click "Start Exam". Leave blank for no time limit.
            </small>
          </div>
          <div className="form-group">
            <label>Questions File</label>
            <input id="exam-questions-file" type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Exam"}</button>
        </form>
      </div>
    </div>
  );
}
