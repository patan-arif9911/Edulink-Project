import React, { useEffect, useMemo, useState } from "react";
import courseApi from "../../api/courseApi";
import examApi from "../../api/examApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Read-only View Grades page (sidebar item: "View Grades").
 *  - Class → Course → Type (Assignment / Exam) cascading dropdowns
 *  - Renders every grade recorded for that course matching the selected type bucket
 *
 * "Assignment" bucket  = examType = ASSIGNMENT
 * "Exam" bucket        = examType in (MIDTERM, FINAL, QUIZ)
 *
 * Grading itself happens in Exam Submissions → View Submission, not here.
 */
const EXAM_TYPES = ["MIDTERM", "FINAL", "QUIZ"];

export default function GradeStudentPage() {
  // Cascading dropdowns
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  const [typeBucket, setTypeBucket] = useState(""); // "ASSIGNMENT" | "EXAM"

  // Grades table
  const [grades, setGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load classes."))
      .finally(() => setClassesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setCourses([]); setSelectedCourseCode("");
      return;
    }
    setCoursesLoading(true);
    setSelectedCourseCode("");
    courseApi
      .fetchCoursesByClass(selectedClassId)
      .then((res) => setCourses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load courses."))
      .finally(() => setCoursesLoading(false));
  }, [selectedClassId]);

  /* Fetch all grades for the course as soon as a course is picked. */
  useEffect(() => {
    if (!selectedCourseCode) { setGrades([]); return; }
    setGradesLoading(true);
    setError("");
    examApi
      .fetchGradesByCourse(selectedCourseCode)
      .then((res) => setGrades(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load grades."))
      .finally(() => setGradesLoading(false));
  }, [selectedCourseCode]);

  /* Filter by the selected type bucket. */
  const filteredGrades = useMemo(() => {
    if (!typeBucket) return [];
    return grades.filter((g) => {
      const t = (g.examType || "").toUpperCase();
      if (typeBucket === "ASSIGNMENT") return t === "ASSIGNMENT";
      return EXAM_TYPES.includes(t);
    });
  }, [grades, typeBucket]);

  if (classesLoading) return <Spinner />;

  const ready = selectedClassId && selectedCourseCode && typeBucket;

  return (
    <div>
      <SectionHeader
        title="View Grades"
        subtitle="Class → Course → Type. Shows every grade recorded for the selection."
      />

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      <div className="page-form">
        <div className="att-controls">
          <div className="form-group">
            <label>Class</label>
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} required>
              <option value="">— Select a class —</option>
              {classes.map((c) => (
                <option key={c.id || c.classId} value={c.id || c.classId}>
                  {c.className || `Class ${c.grade || ""}${c.section || ""}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Course</label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              disabled={!selectedClassId || coursesLoading}
              required
            >
              <option value="">
                {!selectedClassId
                  ? "— Pick a class first —"
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
            <label>Type</label>
            <select
              value={typeBucket}
              onChange={(e) => setTypeBucket(e.target.value)}
              disabled={!selectedCourseCode}
              required
            >
              <option value="">— Select type —</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="EXAM">Exam (Midterm / Final / Quiz)</option>
            </select>
          </div>
        </div>
      </div>

      {ready && (
        gradesLoading ? (
          <Spinner />
        ) : filteredGrades.length === 0 ? (
          <div className="empty-state">
            <p>No grades recorded yet for this {typeBucket === "ASSIGNMENT" ? "assignment" : "exam"} on {selectedCourseCode}.</p>
          </div>
        ) : (
          <div className="att-table-wrap" style={{ marginTop: "1rem" }}>
            <table className="att-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Email</th>
                  <th>Exam Type</th>
                  <th>Marks</th>
                  <th>Passing</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                  <th>Graded By</th>
                  <th>Graded At</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((g) => (
                  <tr key={g.id}>
                    <td>{g.rollNumber}</td>
                    <td>{g.studentEmail}</td>
                    <td>{g.examType}</td>
                    <td>{g.marksObtained} / {g.totalMarks}</td>
                    <td>{g.passingMarks ?? "—"}</td>
                    <td>
                      <span className="sub-pill sub-pill-graded is-selected">{g.grade || "—"}</span>
                    </td>
                    <td title={g.remarks}>{g.remarks || "—"}</td>
                    <td>{g.teacherEmail || "—"}</td>
                    <td>{g.gradedAt ? new Date(g.gradedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
