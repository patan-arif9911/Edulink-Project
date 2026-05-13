import { useState, useEffect, useMemo } from "react";
import courseApi from "../../api/courseApi";
import attendanceApi from "../../api/attendanceApi";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { sortClasses } from "../../utils/sortHelpers";
import "../../styles/pages.css";
import "../../styles/attendance-theme.css";
import "./AttendanceProgressStyles.css";

function AnimatedBar({ percent }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(percent), 120); return () => clearTimeout(t); }, [percent]);   // here it waits for 120ms so that css loads slidingly and clear outs so that it stops reloading
  const pct   = Math.min(100, Math.max(0, percent)); // it is used so that the %is always +ve
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626"; // based on % color changes
  const label = pct >= 75 ? "Good" : pct >= 50 ? "Average" : "Low";
  return (
    <div className="att-bar">
      <div className="att-bar-track">
        <div className="att-bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      <div className="att-bar-meta">
        <span style={{ color }}>{label}</span>
        <span style={{ color }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "—";

export default function AttendanceProgressPage() {

  // we are creating Hooks here using useState
  const [classes, setClasses]               = useState([]);
  const [selectedClass, setSelectedClass]   = useState(null);
  const [students, setStudents]             = useState([]);
  const [attRecords, setAttRecords]         = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [filter, setFilter]                 = useState("all");
  const [search, setSearch]                 = useState("");
  const [fromDate, setFromDate]             = useState("");
  const [toDate, setToDate]                 = useState("");


  // Here we are using useEffect Hook to load the data
  useEffect(() => {
    courseApi.fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoadingClasses(false));
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    if (!classId) { setSelectedClass(null); setStudents([]); setAttRecords([]); return; }
    const cls = classes.find((c) => String(c.id || c.classId) === classId);
    setSelectedClass(cls);
    setLoading(true);
    try {
      const [studRes, attRes] = await Promise.all([
        courseApi.fetchClassStudents(classId),
        attendanceApi.fetchAdminReport({ schoolId: cls?.schoolId || "" }),
      ]);
      const list = studRes.data?.data || studRes.data || [];
      setStudents(Array.isArray(list) ? list : []);
      const recs = attRes.data?.data || attRes.data || [];
      setAttRecords(Array.isArray(recs) ? recs.filter((r) => String(r.courseId) === classId) : []);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ── Date range filter on records ─────────────────────────── */
  const rangedRecords = useMemo(() => {
    if (!fromDate && !toDate) return attRecords;
    const from = fromDate ? new Date(fromDate) : null;
    const to   = toDate   ? new Date(toDate)   : null;
    return attRecords.filter((r) => {
      if (!r.attendanceDate) return false;
      const d = new Date(r.attendanceDate);
      if (from && d < from) return false;
      if (to   && d > to)   return false;
      return true;
    });
  }, [attRecords, fromDate, toDate]);

  const studentStats = useMemo(() => students.map((s) => {
    const recs    = rangedRecords.filter((r) => r.rollNumber === s.rollNumber);
    const total   = recs.length;
    const present = recs.filter((r) => r.status === "PRESENT").length;
    const od      = recs.filter((r) => r.status === "OD").length;
    const absent  = recs.filter((r) => r.status === "ABSENT").length;
    const pct     = total > 0 ? ((present + od) / total) * 100 : 0;
    return { ...s, total, present, od, absent, pct };
  }), [students, rangedRecords]);

  const filtered = studentStats.filter((s) => {
    const matchFilter = filter === "low" ? s.pct < 50 : filter === "full" ? s.pct >= 75 : true;
    const matchSearch = !search ||
      (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const lowCount  = studentStats.filter((s) => s.pct < 50).length;
  const goodCount = studentStats.filter((s) => s.pct >= 75).length;
  const avgCount  = studentStats.filter((s) => s.pct >= 50 && s.pct < 75).length;
  const classAvg  = studentStats.length > 0
    ? (studentStats.reduce((a, s) => a + s.pct, 0) / studentStats.length).toFixed(1)
    : "—";

  if (loadingClasses) return <Spinner />;

  // starting point of the page
  return (
    <div className="att-shell">
      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="att-hero">
        <div className="att-hero-row">
          <div>
            <h1>Attendance Progress</h1>
            <p>Per-student attendance trends and class analytics.</p>
          </div>
          {selectedClass && (
            <span className="att-hero-meta">
              <span className="material-icons">school</span>
              {selectedClass.className || "Class"}
              {selectedClass.courseCode ? ` · ${selectedClass.courseCode}` : ""}
            </span>
          )}
        </div>
      </header>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {/* // this is for selecting the filters like which class which date like that.*/}
      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="att-toolbar">
        <div className="att-field">
          <label>Select Class</label>
          <select onChange={handleClassChange} defaultValue="">
            
            {/* // here we select which class */}
            <option value="">— Select a class —</option>
            {sortClasses(classes).map((cls) => (
              <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                {cls.className || `Class ${cls.id}`}{cls.courseCode ? ` (${cls.courseCode})` : ""}
              </option>
            ))}
          </select>
        </div>
        {selectedClass && (
          <>
            <div className="att-field">
              <label>Performance</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Students</option>
                <option value="low">Low (&lt;50%)</option>
                <option value="full">Good (≥75%)</option>
              </select>
            </div>
            <div className="att-field">
              <label>From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="att-field">
              <label>To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="att-field">
              <label>Search</label>
              <input
                type="text"
                placeholder="Name or roll number…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* ── KPI Cards ─────────────────────────────────────── */}
      {/* five colorfull cards displaying */}
      {selectedClass && studentStats.length > 0 && (
        <div className="att-kpis">
          <div className="att-kpi att-kpi--indigo">
            <div className="att-kpi-icon"><span className="material-icons">groups</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{studentStats.length}</p>
              <p className="att-kpi-label">Total Students</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--green">
            <div className="att-kpi-icon"><span className="material-icons">emoji_events</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{goodCount}</p>
              <p className="att-kpi-label">Good (≥75%)</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--amber">
            <div className="att-kpi-icon"><span className="material-icons">trending_flat</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{avgCount}</p>
              <p className="att-kpi-label">Average (50–74%)</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--red">
            <div className="att-kpi-icon"><span className="material-icons">warning</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{lowCount}</p>
              <p className="att-kpi-label">Low (&lt;50%)</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--purple">
            <div className="att-kpi-icon"><span className="material-icons">analytics</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{classAvg}{classAvg !== "—" ? "%" : ""}</p>
              <p className="att-kpi-label">Class Average</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────── */}
      {loading ? (
        <div style={{ marginTop: "1rem" }}><Spinner /></div>
      ) : selectedClass && filtered.length > 0 ? (
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Present</th>
                <th>Absent</th>
                <th>OD</th>
                <th>Total</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.rollNumber || idx}>
                  <td className="att-cell-idx">{idx + 1}</td>
                  <td>
                    <div className="att-cell-name">
                      <span className="att-avatar">{initials(s.fullName)}</span>
                      <span>
                        {s.pct < 50 && <span className="material-icons att-warn" style={{ marginRight: 4 }}>warning</span>}
                        {s.fullName || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="att-cell-roll">{s.rollNumber || "—"}</td>
                  <td><span className="att-chip att-chip--present">{s.present}</span></td>
                  <td><span className="att-chip att-chip--absent">{s.absent}</span></td>
                  <td><span className="att-chip att-chip--od">{s.od}</span></td>
                  <td>{s.total}</td>
                  <td style={{ minWidth: 200 }}><AnimatedBar percent={s.pct} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedClass ? (
        <div className="att-empty">
          <span className="material-icons">analytics</span>
          <p>
            {students.length === 0
              ? "No students enrolled in this class."
              : "No attendance records in this range. Mark attendance first."}
          </p>
          {(fromDate || toDate) && students.length > 0 && (
            <small>Tip: clear the date range to see all-time data.</small>
          )}
        </div>
      ) : (
        <div className="att-empty">
          <span className="material-icons">insights</span>
          <p>Pick a class to view attendance progress.</p>
        </div>
      )}
    </div>
  );
}
