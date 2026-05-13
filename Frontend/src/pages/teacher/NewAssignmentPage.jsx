import React, { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function NewAssignmentPage() {
  // Cascading dropdowns: class → course
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  // Assignment fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load classes."))
      .finally(() => setClassesLoading(false));
  }, []);

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
    formData.append("title", title);
    formData.append("description", description);
    if (dueDate) formData.append("dueDate", dueDate + "T23:59:59");
    if (maxMarks) formData.append("maxMarks", maxMarks);
    if (file) formData.append("questionsFile", file);

    setLoading(true);
    try {
      await courseApi.createAssignment(formData);
      setSuccess(`Assignment created for ${selectedCourse?.courseName || selectedCourseCode} in ${selectedClass?.className || ""}.`);
      // Keep class/course selection so the teacher can quickly add another assignment to the same course
      setTitle("");
      setDescription("");
      setDueDate("");
      setMaxMarks("");
      setFile(null);
      const fileInput = document.getElementById("assignment-questions-file");
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
      <SectionHeader title="New Assignment" subtitle="Select a class and course, then enter assignment details" />
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
            <small style={{ color: "#666" }}>
              Assignment number is auto-generated based on existing assignments for this course.
            </small>
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
            <label>Questions File</label>
            <input id="assignment-questions-file" type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Assignment"}</button>
        </form>
      </div>
    </div>
  );
}
