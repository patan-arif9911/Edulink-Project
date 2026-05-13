import { useState, useEffect, useMemo } from "react";
import courseApi from "../../api/courseApi";
import attendanceApi from "../../api/attendanceApi";
import identityApi from "../../api/identityApi";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { sortClasses } from "../../utils/sortHelpers";
import "../../styles/pages.css";
import "../../styles/attendance-theme.css";
import "./AttendanceReportStyles.css";

function CircularProgress({ percent, size = 72 }) {
  const pct = Math.min(100, Math.max(0, percent));
  const r = (size - 10) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eef0f6" strokeWidth={7} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
          transform: "rotate(-90deg)",
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      <text
        x={cx} y={cy + 4} textAnchor="middle"
        fontSize={size >= 56 ? 14 : 11} fontWeight="800" fill={color}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
}

function ProgressBar({ percent }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(percent), 100); return () => clearTimeout(t); }, [percent]);
  const pct = Math.min(100, Math.max(0, percent));
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="att-bar">
      <div className="att-bar-track">
        <div className="att-bar-fill" style={{ width: `${w}%`, background: color }} />
      </div>
      <div className="att-bar-meta">
        <span style={{ color }}>{pct >= 75 ? "Good" : pct >= 50 ? "Average" : "Low"}</span>
        <span style={{ color }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "—";

export default function AttendanceReportPage() {
  const [classes, setClasses]               = useState([]);
  const [selectedClass, setSelectedClass]   = useState(null);
  const [students, setStudents]             = useState([]);
  const [records, setRecords]               = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [search, setSearch]                 = useState("");
  const [fromDate, setFromDate]             = useState("");
  const [toDate, setToDate]                 = useState("");

  useEffect(() => {
    courseApi.fetchAdminClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => setError("Failed to load classes."))
      .finally(() => setLoadingClasses(false));
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    if (!classId) { setSelectedClass(null); setStudents([]); setRecords([]); return; }
    const cls = classes.find((c) => String(c.id || c.classId) === classId);
    setSelectedClass(cls);
    setLoading(true); setError("");
    try {
      const [studRes, attRes] = await Promise.all([
        identityApi.fetchStudents(),
        attendanceApi.fetchAdminReport({ schoolId: cls?.schoolId || "" }),
      ]);
      const allStudents = studRes.data?.data || studRes.data || [];
      const classStudents = allStudents.filter((s) => String(s.classId) === classId);
      setStudents(classStudents);
      const allRecords = attRes.data?.data || attRes.data || [];
      const classRecords = Array.isArray(allRecords)
        ? allRecords.filter((r) => String(r.courseId) === classId)
        : [];
      setRecords(classRecords);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const rangedRecords = useMemo(() => {
    if (!fromDate && !toDate) return records;
    const from = fromDate ? new Date(fromDate) : null;
    const to   = toDate   ? new Date(toDate)   : null;
    return records.filter((r) => {
      if (!r.attendanceDate) return false;
      const d = new Date(r.attendanceDate);
      if (from && d < from) return false;
      if (to   && d > to)   return false;
      return true;
    });
  }, [records, fromDate, toDate]);

  const studentStats = useMemo(() => students.map((s) => {
    const recs    = rangedRecords.filter((r) => r.rollNumber === s.rollNumber || r.rollNumber === s.email);
    const total   = recs.length;
    const present = recs.filter((r) => r.status === "PRESENT").length;
    const absent  = recs.filter((r) => r.status === "ABSENT").length;
    const od      = recs.filter((r) => r.status === "OD").length;
    const pct     = total > 0 ? ((present + od) / total) * 100 : 0;
    return { ...s, total, present, absent, od, pct };
  }), [students, rangedRecords]);

  const filtered = studentStats.filter((s) =>
    !search ||
    (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const classAvg = filtered.length > 0
    ? filtered.reduce((sum, s) => sum + s.pct, 0) / filtered.length : 0;

  const aboveGood = filtered.filter((s) => s.pct >= 75).length;
  const belowLow  = filtered.filter((s) => s.pct < 50).length;

  /* ── CSV export ─────────────────────────────────────────── */
  const handleExportCSV = () => {
    const rangeStr = (fromDate || toDate) ? `${fromDate || "…"} to ${toDate || "…"}` : "All time";
    const csv = [
      ["Attendance Report"],
      ["Class", selectedClass?.className || "—"],
      ["Range", rangeStr],
      ["Generated", new Date().toLocaleString("en-IN")],
      [],
      ["#", "Student Name", "Roll Number", "Class", "Present", "Absent", "OD", "Working Days", "Attendance %"],
      ...filtered.map((s, idx) => [
        idx + 1,
        s.fullName || "—",
        s.rollNumber || s.email || "—",
        selectedClass?.className || "—",
        s.present, s.absent, s.od, s.total, s.pct.toFixed(1) + "%",
      ]),
    ].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `attendance-${selectedClass?.className || "class"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── PDF export via window.print (printable area only) ──── */
  const handleExportPDF = () => {
    const area = document.getElementById("att-print-area");
    if (!area) return;
    area.classList.add("att-print-area--rendering");
    const originalTitle = document.title;
    document.title = `Attendance-${selectedClass?.className || "Report"}-${new Date().toISOString().slice(0, 10)}`;
    window.print();
    setTimeout(() => {
      area.classList.remove("att-print-area--rendering");
      document.title = originalTitle;
    }, 600);
  };

  if (loadingClasses) return <Spinner />;

  const rangeLabel = (fromDate || toDate) ? `${fromDate || "…"} → ${toDate || "…"}` : "All time";

  return (
    <div className="att-shell">
      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="att-hero att-print-hide">
        <div className="att-hero-row">
          <div>
            <h1>Attendance Report</h1>
            <p>Class-wise attendance analysis with percentage breakdown.</p>
          </div>
          <span className="att-hero-meta">
            <span className="material-icons">date_range</span>
            {rangeLabel}
          </span>
        </div>
      </header>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="att-toolbar att-print-hide">
        <div className="att-field">
          <label>Select Class</label>
          <select onChange={handleClassChange} defaultValue="">
            <option value="">— Select a class —</option>
            {sortClasses(classes).map((cls) => (
              <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                {cls.className || cls.name || `Class ${cls.id}`}
                {cls.grade ? ` — Grade ${cls.grade}` : ""}
                {cls.section ? `, Sec ${cls.section}` : ""}
              </option>
            ))}
          </select>
        </div>
        {selectedClass && (
          <>
            <div className="att-field">
              <label>From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="att-field">
              <label>To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div className="att-field">
              <label>Search Student</label>
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

      {/* ── Overview Card ─────────────────────────────────── */}
      {selectedClass && filtered.length > 0 && (
        <div className="att-panel">
          <div className="att-panel-head">
            <p className="att-panel-title">
              <span className="material-icons">summarize</span>
              {selectedClass.className || "Class"} — Overview
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} className="att-print-hide">
              <button className="att-secondary-btn" onClick={handleExportCSV}>
                <span className="material-icons">download</span>
                CSV
              </button>
              <button className="att-secondary-btn" onClick={handleExportPDF}>
                <span className="material-icons">picture_as_pdf</span>
                PDF
              </button>
            </div>
          </div>
          <div className="att-panel-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <CircularProgress percent={classAvg} size={84} />
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>
                  Class Average: {classAvg.toFixed(1)}%
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#475569" }}>
                  <strong style={{ color: "#16a34a" }}>{aboveGood}</strong> above 75% &nbsp;·&nbsp;
                  <strong style={{ color: "#dc2626" }}>{belowLow}</strong> below 50% &nbsp;·&nbsp;
                  {filtered.length} students
                </p>
              </div>
            </div>
            <div className="att-legend">
              <span><span className="att-legend-dot" style={{ background: "#16a34a" }} />≥75% Good</span>
              <span><span className="att-legend-dot" style={{ background: "#d97706" }} />50–74% Average</span>
              <span><span className="att-legend-dot" style={{ background: "#dc2626" }} />&lt;50% Low</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────── */}
      {loading ? (
        <div style={{ marginTop: "1rem" }}><Spinner /></div>
      ) : selectedClass && filtered.length > 0 ? (
        <div className="att-table-wrap att-print-hide">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Present</th>
                <th>Absent</th>
                <th>OD</th>
                <th>Days</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id || idx}>
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
                  <td className="att-cell-roll">{s.rollNumber || s.email || "—"}</td>
                  <td><span className="att-tag">{selectedClass?.className || "—"}</span></td>
                  <td><span className="att-chip att-chip--present">{s.present}</span></td>
                  <td><span className="att-chip att-chip--absent">{s.absent}</span></td>
                  <td><span className="att-chip att-chip--od">{s.od}</span></td>
                  <td>{s.total}</td>
                  <td style={{ minWidth: 180 }}><ProgressBar percent={s.pct} /></td>
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
        </div>
      ) : (
        <div className="att-empty">
          <span className="material-icons">assessment</span>
          <p>Pick a class to generate the attendance report.</p>
        </div>
      )}

      {/* ── Printable area (only visible during print) ───── */}
      <div id="att-print-area" className="att-print-area">
        <h2 style={{ marginTop: 0 }}>Attendance Report — {selectedClass?.className || "—"}</h2>
        <p style={{ color: "#475569", fontSize: "0.9rem" }}>
          Range: <strong>{rangeLabel}</strong> ·{" "}
          Generated: {new Date().toLocaleString("en-IN")}
        </p>
        <p style={{ color: "#475569", fontSize: "0.9rem" }}>
          Class Average: <strong>{classAvg.toFixed(1)}%</strong> ·{" "}
          {aboveGood} ≥75% · {belowLow} &lt;50% · Total {filtered.length}
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #334155" }}>
              {["#", "Student", "Roll No.", "Present", "Absent", "OD", "Days", "Attendance %"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "6px 8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={s.id || idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "6px 8px" }}>{idx + 1}</td>
                <td style={{ padding: "6px 8px" }}>{s.fullName || "—"}</td>
                <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{s.rollNumber || s.email || "—"}</td>
                <td style={{ padding: "6px 8px", color: "#16a34a" }}>{s.present}</td>
                <td style={{ padding: "6px 8px", color: "#dc2626" }}>{s.absent}</td>
                <td style={{ padding: "6px 8px", color: "#7c3aed" }}>{s.od}</td>
                <td style={{ padding: "6px 8px" }}>{s.total}</td>
                <td style={{ padding: "6px 8px", fontWeight: 700 }}>{s.pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
