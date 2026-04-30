import React, { useState, useEffect, useContext } from "react";
import attendanceApi from "../../api/attendanceApi";
import courseApi from "../../api/courseApi";
import { AuthContext } from "../../context/AuthContext";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function RecordAttendancePage() {
  const { currentUser } = useContext(AuthContext);

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null); // full class object
  const [form, setForm] = useState({
    rollNumber: "",
    courseId: "",
    schoolId: "",
    attendanceDate: new Date().toISOString().split("T")[0],
    status: "PRESENT",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Load teacher's classes on mount */
  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoadingClasses(false));
  }, []);

  /* When a class is selected, load its students */
  const handleClassChange = (e) => {
    const classId = e.target.value;
    if (!classId) {
      setSelectedClass(null);
      setStudents([]);
      setForm((f) => ({ ...f, courseId: "", schoolId: "", rollNumber: "" }));
      return;
    }
    const cls = classes.find((c) => String(c.id || c.classId) === classId);
    setSelectedClass(cls);
    setForm((f) => ({
      ...f,
      courseId: cls?.id || cls?.classId || "",
      schoolId: cls?.schoolId || currentUser?.schoolId || "",
      rollNumber: "",
    }));
    setLoadingStudents(true);
    courseApi
      .fetchClassStudents(classId)
      .then((res) => setStudents(res.data?.data || res.data || []))
      .catch(() => setError("Failed to load students for this class."))
      .finally(() => setLoadingStudents(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.rollNumber) { setError("Please select a student."); return; }
    setLoading(true);
    try {
      await attendanceApi.markAttendance({
        rollNumber: form.rollNumber,
        courseId: Number(form.courseId),
        schoolId: form.schoolId,
        attendanceDate: form.attendanceDate,
        status: form.status,
      });
      setSuccess("Attendance recorded successfully!");
      setForm((f) => ({ ...f, rollNumber: "" }));
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loadingClasses) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Mark Attendance" subtitle="Select a class and mark student attendance" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>

          {/* Class selector */}
          <div className="form-group">
            <label>Class</label>
            <select onChange={handleClassChange} defaultValue="" disabled={loading}>
              <option value="">— Select a class —</option>
              {classes.map((cls) => (
                <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                  {cls.className || cls.name || `Class ${cls.id || cls.classId}`}
                  {cls.courseCode ? ` (${cls.courseCode})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Student selector — shown after class is picked */}
          {selectedClass && (
            <div className="form-group">
              <label>Student</label>
              {loadingStudents ? (
                <p>Loading students…</p>
              ) : (
                <select
                  value={form.rollNumber}
                  onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                  required
                  disabled={loading}
                >
                  <option value="">— Select a student —</option>
                  {students.map((s) => (
                    <option key={s.rollNumber || s.studentId} value={s.rollNumber}>
                      {s.fullName} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.attendanceDate}
              onChange={(e) => setForm((f) => ({ ...f, attendanceDate: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              disabled={loading}
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="EXCUSED">Excused</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !selectedClass}>
            {loading ? "Recording…" : "Mark Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}
