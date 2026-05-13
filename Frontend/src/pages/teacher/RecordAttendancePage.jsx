import React, { useState, useEffect, useContext, useMemo } from "react";
import attendanceApi from "../../api/attendanceApi";
import courseApi from "../../api/courseApi";
import { AuthContext } from "../../context/AuthContext";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present", className: "att-pill-present" },
  { value: "ABSENT",  label: "Absent",  className: "att-pill-absent"  },
  { value: "OD",      label: "OD",      className: "att-pill-od"      },
];

const todayISO = () => new Date().toISOString().split("T")[0];

export default function RecordAttendancePage() {
  const { currentUser } = useContext(AuthContext);

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(todayISO());

  // Map keyed by rollNumber → "PRESENT" | "ABSENT" | "OD" (or another legacy status from backend)
  const [statuses, setStatuses] = useState({});

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Load teacher's classes once on mount */
  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoadingClasses(false));
  }, []);

  /* When class OR date changes: load roster + any existing attendance for that day */
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setStatuses({});
      return;
    }
    const classId = selectedClass.id || selectedClass.classId;
    if (!classId) return;

    setLoadingStudents(true);
    setError("");
    setSuccess("");

    Promise.all([
      courseApi.fetchClassStudents(classId),
      attendanceApi.fetchClassAttendance({ courseId: classId, date: attendanceDate }),
    ])
      .then(([studentsRes, attendanceRes]) => {
        const roster = studentsRes.data?.data || studentsRes.data || [];
        const existing = attendanceRes.data?.data || attendanceRes.data || [];
        setStudents(roster);
        // Pre-fill statuses from existing records so teachers can amend, not duplicate
        const prefill = {};
        existing.forEach((rec) => {
          if (rec.rollNumber) prefill[rec.rollNumber] = rec.status;
        });
        setStatuses(prefill);
      })
      .catch((err) => setError(parseApiError(err) || "Failed to load roster."))
      .finally(() => setLoadingStudents(false));
  }, [selectedClass, attendanceDate]);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    if (!classId) {
      setSelectedClass(null);
      return;
    }
    const cls = classes.find((c) => String(c.id || c.classId) === classId);
    setSelectedClass(cls || null);
  };

  const setStudentStatus = (rollNumber, status) => {
    setStatuses((prev) => ({ ...prev, [rollNumber]: status }));
  };

  const markedCount = useMemo(
    () => Object.values(statuses).filter(Boolean).length,
    [statuses]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedClass) { setError("Please select a class."); return; }
    if (!attendanceDate) { setError("Please choose a date."); return; }
    if (markedCount === 0) { setError("Mark at least one student before saving."); return; }

    const courseId = Number(selectedClass.id || selectedClass.classId);
    const schoolId = selectedClass.schoolId || currentUser?.schoolId || "";

    const entries = students
      .filter((s) => statuses[s.rollNumber])
      .map((s) => ({ rollNumber: s.rollNumber, status: statuses[s.rollNumber] }));

    setSaving(true);
    try {
      const res = await attendanceApi.markAttendanceBulk({
        courseId,
        schoolId,
        attendanceDate,
        entries,
      });
      const msg = res.data?.message || `Attendance saved for ${entries.length} students.`;
      setSuccess(msg);
    } catch (err) {
      setError(parseApiError(err) || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingClasses) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Mark Attendance"
        subtitle="Select a class and date, then mark each student as Present, Absent, or OD."
      />

      <div className="page-form">
        <AlertBanner type="error"   message={error}   onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />

        <form onSubmit={handleSubmit}>
          <div className="att-controls">
            <div className="form-group">
              <label>Class</label>
              <select
                onChange={handleClassChange}
                value={selectedClass ? String(selectedClass.id || selectedClass.classId) : ""}
                disabled={saving}
              >
                <option value="">— Select a class —</option>
                {classes.map((cls) => (
                  <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                    {cls.className || cls.name || `Class ${cls.id || cls.classId}`}
                    {cls.courseCode ? ` (${cls.courseCode})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                max={todayISO()}
                disabled={saving}
                required
              />
            </div>
          </div>

          {selectedClass && (
            loadingStudents ? (
              <Spinner />
            ) : students.length === 0 ? (
              <p className="att-empty">No students are enrolled in this class.</p>
            ) : (
              <>
                <div className="att-summary">
                  Marked <strong>{markedCount}</strong> of <strong>{students.length}</strong> students
                </div>

                <div className="att-table-wrap">
                  <table className="att-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => {
                        const current = statuses[s.rollNumber];
                        return (
                          <tr key={s.rollNumber}>
                            <td>{s.rollNumber}</td>
                            <td>{s.fullName || s.name || "—"}</td>
                            <td>
                              <div className="att-pill-group">
                                {STATUS_OPTIONS.map((opt) => {
                                  const isSelected = current === opt.value;
                                  return (
                                    <button
                                      type="button"
                                      key={opt.value}
                                      className={`att-pill ${opt.className}${isSelected ? " is-selected" : ""}`}
                                      onClick={() => setStudentStatus(s.rollNumber, opt.value)}
                                      disabled={saving}
                                      aria-pressed={isSelected}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                                {current && !STATUS_OPTIONS.some((o) => o.value === current) && (
                                  // Legacy status (LATE/EXCUSED) preserved from existing data
                                  <span className="att-pill att-pill-legacy is-selected">{current}</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={saving || markedCount === 0}
                >
                  {saving ? "Saving…" : "Save Attendance"}
                </button>
              </>
            )
          )}
        </form>
      </div>
    </div>
  );
}
