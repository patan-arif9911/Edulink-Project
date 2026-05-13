import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import attendanceApi from "../../api/attendanceApi";
import courseApi from "../../api/courseApi";
import { AuthContext } from "../../context/AuthContext";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { sortClasses } from "../../utils/sortHelpers";
import "../../styles/pages.css";
import "../../styles/attendance-theme.css";
import "./AttendanceStyles.css";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present", short: "P", icon: "check_circle", className: "att-pill-btn--present" },
  { value: "ABSENT",  label: "Absent",  short: "A", icon: "cancel",       className: "att-pill-btn--absent"  },
  { value: "OD",      label: "OD",      short: "O", icon: "work",         className: "att-pill-btn--od"      },
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

export default function RecordAttendancePage() {
  const { currentUser }  = useContext(AuthContext);
  const location         = useLocation();
  const preselectedId    = location.state?.preselectedClassId;

  const [classes, setClasses]               = useState([]);
  const [students, setStudents]             = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedClass, setSelectedClass]   = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [statusMap, setStatusMap]           = useState({});
  const [search, setSearch]                 = useState("");
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState("");
  const [focusedRow, setFocusedRow]         = useState(null);
  const rowRefs                              = useRef({});
  const dateInputRef                         = useRef(null);

  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try { el.showPicker(); return; } catch { /* fall through */ }
    }
    el.focus();
  };

  useEffect(() => {
    courseApi.fetchTeacherClasses()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setClasses(list);
        if (preselectedId) {
          const cls = list.find((c) => String(c.id || c.classId) === String(preselectedId));
          if (cls) loadStudents(cls);
        }
      })
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoadingClasses(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStudents = (cls) => {
    setSelectedClass(cls);
    setStatusMap({});
    setSuccess("");
    setLoadingStudents(true);
    courseApi.fetchClassStudents(cls.id || cls.classId)
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setStudents(Array.isArray(list) ? list : []);
        const defaults = {};
        list.forEach((s) => { defaults[s.rollNumber] = "PRESENT"; });
        setStatusMap(defaults);
      })
      .catch(() => setError("Failed to load students for this class."))
      .finally(() => setLoadingStudents(false));
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    if (!classId) { setSelectedClass(null); setStudents([]); setStatusMap({}); return; }
    const cls = classes.find((c) => String(c.id || c.classId) === classId);
    if (cls) loadStudents(cls);
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => { updated[s.rollNumber] = status; });
    setStatusMap(updated);
  };

  const toggleStatus = (rollNumber, status) =>
    setStatusMap((prev) => ({ ...prev, [rollNumber]: status }));

  /* ── Keyboard shortcuts: P / A / O on focused row, ↑ ↓ navigate ── */
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.trim().toLowerCase();
    return students.filter((s) =>
      (s.fullName || s.name || "").toLowerCase().includes(q) ||
      (s.rollNumber || "").toLowerCase().includes(q)
    );
  }, [students, search]);

  useEffect(() => {
    const onKey = (e) => {
      if (!focusedRow || filteredStudents.length === 0) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      const idx = filteredStudents.findIndex((s) => s.rollNumber === focusedRow);
      const map = { p: "PRESENT", a: "ABSENT", o: "OD" };
      const key = e.key.toLowerCase();
      if (map[key]) {
        e.preventDefault();
        toggleStatus(focusedRow, map[key]);
        const next = filteredStudents[idx + 1];
        if (next) {
          setFocusedRow(next.rollNumber);
          rowRefs.current[next.rollNumber]?.focus();
        }
      } else if (e.key === "ArrowDown" && idx < filteredStudents.length - 1) {
        e.preventDefault();
        const next = filteredStudents[idx + 1];
        setFocusedRow(next.rollNumber);
        rowRefs.current[next.rollNumber]?.focus();
      } else if (e.key === "ArrowUp" && idx > 0) {
        e.preventDefault();
        const prev = filteredStudents[idx - 1];
        setFocusedRow(prev.rollNumber);
        rowRefs.current[prev.rollNumber]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedRow, filteredStudents]);

  const handleSave = async () => {
    if (!selectedClass) { setError("Please select a class."); return; }
    if (students.length === 0) { setError("No students to mark."); return; }
    const schoolId = selectedClass.schoolId || currentUser?.schoolId || "";
    if (!schoolId) { setError("Could not determine school for this class."); return; }
    const markedBy = (currentUser?.email || currentUser?.fullName || "TEACHER").slice(0, 50);
    setSaving(true); setError(""); setSuccess("");
    try {
      const records = students.map((s) => ({
        rollNumber:     s.rollNumber,
        courseId:       Number(selectedClass.id || selectedClass.classId),
        schoolId,
        attendanceDate,
        status:         statusMap[s.rollNumber] || "PRESENT",
        markedBy,
      }));
      await Promise.all(records.map((r) => attendanceApi.markAttendance(r)));
      setSuccess(`Attendance saved for ${students.length} student${students.length === 1 ? "" : "s"} on ${attendanceDate}.`);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const counts = students.reduce((acc, s) => {
    const st = statusMap[s.rollNumber] || "PRESENT";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const todayLabel = new Date(attendanceDate).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  if (loadingClasses) return <Spinner />;

  return (
    <div className="att-shell">
      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="att-hero">
        <div className="att-hero-row">
          <div>
            <h1>Mark Attendance</h1>
            <p>Select a class to load the roster, then record today's attendance.</p>
          </div>
          <button
            type="button"
            className="att-hero-meta att-hero-meta--btn"
            onClick={openDatePicker}
            title="Change attendance date"
          >
            <span className="material-icons">event</span>
            {todayLabel}
            <span className="material-icons" style={{ fontSize: 16, opacity: 0.85 }}>edit_calendar</span>
          </button>
        </div>
      </header>

      <AlertBanner type="error"   message={error}   onClose={() => setError("")} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />

      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="att-toolbar">
        <div className="att-field">
          <label>Class / Course</label>
          <select
            onChange={handleClassChange}
            value={selectedClass ? String(selectedClass.id || selectedClass.classId) : ""}
          >
            <option value="">— Select a class —</option>
            {sortClasses(classes).map((cls) => (
              <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                {cls.className || cls.name || `Class ${cls.id || cls.classId}`}
                {cls.courseCode ? ` (${cls.courseCode})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="att-field">
          <label>Attendance Date</label>
          <input
            ref={dateInputRef}
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        {selectedClass && students.length > 0 && (
          <div className="att-field">
            <label>Search Roster</label>
            <input
              type="text"
              placeholder="Name or roll number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ── KPI counts ────────────────────────────────────── */}
      {selectedClass && students.length > 0 && (
        <div className="att-kpis">
          <div className="att-kpi att-kpi--green">
            <div className="att-kpi-icon"><span className="material-icons ">check_circle</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{counts.PRESENT || 0}</p>
              <p className="att-kpi-label">Present</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--red">
            <div className="att-kpi-icon"><span className="material-icons">cancel</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{counts.ABSENT || 0}</p>
              <p className="att-kpi-label">Absent</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--purple">
            <div className="att-kpi-icon"><span className="material-icons">work</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{counts.OD || 0}</p>
              <p className="att-kpi-label">On Duty</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--indigo">
            <div className="att-kpi-icon"><span className="material-icons">groups</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{students.length}</p>
              <p className="att-kpi-label">Total Roster</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick-mark + keyboard hint ────────────────────── */}
      {selectedClass && students.length > 0 && (
        <div className="att-panel">
          <div className="att-panel-head">
            <p className="att-panel-title">
              <span className="material-icons">bolt</span>
              Quick actions
            </p>
            <span className="att-panel-sub">
              Tip: focus a row and press <span className="att-kbd">P</span>{" "}
              <span className="att-kbd">A</span> <span className="att-kbd">O</span> ·
              <span className="att-kbd">↑</span> <span className="att-kbd">↓</span> to move
            </span>
          </div>
          <div className="att-panel-body" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="att-pill-btn att-pill-btn--present att-pill-btn--active" onClick={() => markAll("PRESENT")}>
              <span className="material-icons">check_circle</span> Mark all Present
            </button>
            <button className="att-pill-btn att-pill-btn--absent" onClick={() => markAll("ABSENT")}>
              <span className="material-icons">cancel</span> Mark all Absent
            </button>
            <button className="att-pill-btn att-pill-btn--od" onClick={() => markAll("OD")}>
              <span className="material-icons">work</span> Mark all OD
            </button>
          </div>
        </div>
      )}

      {/* ── Roster ───────────────────────────────────────── */}
      {loadingStudents ? (
        <div style={{ marginTop: "1rem" }}><Spinner /></div>
      ) : selectedClass && filteredStudents.length > 0 ? (
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => {
                const currentStatus = statusMap[s.rollNumber] || "PRESENT";
                return (
                  <tr
                    key={s.rollNumber || idx}
                    ref={(el) => { if (el) rowRefs.current[s.rollNumber] = el; }}
                    className={`att-row att-row--${currentStatus.toLowerCase()}`}
                    tabIndex={0}
                    onFocus={() => setFocusedRow(s.rollNumber)}
                    onClick={() => setFocusedRow(s.rollNumber)}
                  >
                    <td className="att-cell-idx">{idx + 1}</td>
                    <td className="att-cell-roll">{s.rollNumber || "—"}</td>
                    <td>
                      <div className="att-cell-name">
                        <span className="att-avatar">{initials(s.fullName || s.name)}</span>
                        <span>{s.fullName || s.name || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="att-status-cell">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            className={`att-pill-btn ${opt.className} ${currentStatus === opt.value ? "att-pill-btn--active" : ""}`}
                            onClick={(e) => { e.stopPropagation(); toggleStatus(s.rollNumber, opt.value); }}
                            title={`${opt.label} (press ${opt.short})`}
                          >
                            <span className="material-icons">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : selectedClass && students.length === 0 ? (
        <div className="att-empty">
          <span className="material-icons">groups</span>
          <p>No students enrolled in this class.</p>
        </div>
      ) : selectedClass ? (
        <div className="att-empty">
          <span className="material-icons">search_off</span>
          <p>No students match "{search}".</p>
        </div>
      ) : (
        <div className="att-empty">
          <span className="material-icons">menu_book</span>
          <p>Pick a class above to start marking attendance.</p>
        </div>
      )}

      {/* ── Sticky save bar ──────────────────────────────── */}
      {selectedClass && students.length > 0 && (
        <div className="att-stickybar">
          <div className="att-stickybar-info">
            <strong>{students.length}</strong> student{students.length === 1 ? "" : "s"} ·{" "}
            <span style={{ color: "#16a34a" }}>{counts.PRESENT || 0} present</span> ·{" "}
            <span style={{ color: "#dc2626" }}>{counts.ABSENT || 0} absent</span> ·{" "}
            <span style={{ color: "#7c3aed" }}>{counts.OD || 0} OD</span>
          </div>
          <button className="att-primary-btn" onClick={handleSave} disabled={saving}>
            <span className="material-icons">{saving ? "hourglass_top" : "save"}</span>
            {saving ? "Saving…" : "Save Attendance"}
          </button>
        </div>
      )}
    </div>
  );
}
