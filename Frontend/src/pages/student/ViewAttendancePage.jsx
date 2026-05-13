import { useState, useEffect, useMemo } from "react";
import studentApi from "../../api/studentApi";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDate } from "../../utils/dateFormatters";
import "../../styles/pages.css";
import "../../styles/attendance-theme.css";

function CircularProgress({ percent, size = 96 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(percent), 120); return () => clearTimeout(t); }, [percent]);
  const pct = Math.min(100, Math.max(0, animated));
  const r = (size - 12) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={8} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
          transform: "rotate(-90deg)",
          transformOrigin: `${cx}px ${cy}px`,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
        }}
      />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={18} fontWeight="800" fill="#fff">
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
}

function ProgressBar({ attended, total }) {
  const pct = total > 0 ? (attended / total) * 100 : 0;
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(pct), 120); return () => clearTimeout(t); }, [pct]);
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  const label = pct >= 75 ? "Good Progress" : pct >= 50 ? "Moderate" : "Low Progress";
  return (
    <div className="att-bar">
      <div className="att-bar-track">
        <div className="att-bar-fill" style={{ width: `${animated}%`, background: color }} />
      </div>
      <div className="att-bar-meta">
        <span style={{ color, fontWeight: 700 }}>{label}</span>
        <span style={{ color: "#64748b" }}>{attended}/{total} classes · <span style={{ color, fontWeight: 800 }}>{pct.toFixed(1)}%</span></span>
      </div>
    </div>
  );
}

export default function ViewAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [view, setView]       = useState("summary");

  useEffect(() => {
    studentApi
      .fetchAttendance()
      .then((res) => setRecords(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const courseSummaries = useMemo(() => {
    const groups = records.reduce((acc, r) => {
      const key = r.courseId || "Unknown";
      if (!acc[key]) acc[key] = { courseId: key, courseName: r.courseName || `Course ${key}`, records: [] };
      acc[key].records.push(r);
      return acc;
    }, {});
    return Object.values(groups).map((cg) => {
      const total   = cg.records.length;
      const present = cg.records.filter((r) => r.status === "PRESENT").length;
      const od      = cg.records.filter((r) => r.status === "OD").length;
      const absent  = cg.records.filter((r) => r.status === "ABSENT").length;
      const pct     = total > 0 ? ((present + od) / total) * 100 : 0;
      return { ...cg, total, present, od, absent, pct };
    });
  }, [records]);

  const totalPresent = records.filter((r) => r.status === "PRESENT").length;
  const totalAbsent  = records.filter((r) => r.status === "ABSENT").length;
  const totalOD      = records.filter((r) => r.status === "OD").length;
  const overallPct   = records.length > 0
    ? ((totalPresent + totalOD) / records.length) * 100 : 0;

  if (loading) return <Spinner />;

  return (
    <div className="att-shell">
      {/* ── Hero with circular overall progress ─────────── */}
      <header className="att-hero">
        <div className="att-hero-row">
          <div>
            <h1>My Attendance</h1>
            <p>Your course-wise attendance progress and full history.</p>
          </div>
          {records.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <CircularProgress percent={overallPct} size={96} />
              <div>
                <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85 }}>
                  Overall Attendance
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "1.4rem", fontWeight: 800 }}>
                  {overallPct.toFixed(1)}%
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "0.78rem", opacity: 0.85 }}>
                  Across {courseSummaries.length} course{courseSummaries.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {/* ── KPI overview ─────────────────────────────────── */}
      {records.length > 0 && (
        <div className="att-kpis">
          <div className="att-kpi att-kpi--indigo">
            <div className="att-kpi-icon"><span className="material-icons">event_available</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{records.length}</p>
              <p className="att-kpi-label">Total Records</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--green">
            <div className="att-kpi-icon"><span className="material-icons">check_circle</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{totalPresent}</p>
              <p className="att-kpi-label">Present</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--red">
            <div className="att-kpi-icon"><span className="material-icons">cancel</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{totalAbsent}</p>
              <p className="att-kpi-label">Absent</p>
            </div>
          </div>
          <div className="att-kpi att-kpi--purple">
            <div className="att-kpi-icon"><span className="material-icons">work</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{totalOD}</p>
              <p className="att-kpi-label">On Duty</p>
            </div>
          </div>
          <div
            className={`att-kpi ${overallPct >= 75 ? "att-kpi--green" : overallPct >= 50 ? "att-kpi--amber" : "att-kpi--red"}`}
          >
            <div className="att-kpi-icon"><span className="material-icons">percent</span></div>
            <div className="att-kpi-body">
              <p className="att-kpi-val">{overallPct.toFixed(1)}%</p>
              <p className="att-kpi-label">Overall</p>
            </div>
          </div>
        </div>
      )}

      {/* ── View toggle ─────────────────────────────────── */}
      {records.length > 0 && (
        <div className="att-tabs">
          <button
            className={`att-tab ${view === "summary" ? "att-tab--active" : ""}`}
            onClick={() => setView("summary")}
          >
            Course Summary
          </button>
          <button
            className={`att-tab ${view === "detail" ? "att-tab--active" : ""}`}
            onClick={() => setView("detail")}
          >
            Detailed Records
          </button>
        </div>
      )}

      {/* ── Summary cards per course ─────────────────────── */}
      {view === "summary" && (
        courseSummaries.length === 0 ? (
          <div className="att-empty">
            <span className="material-icons">event_busy</span>
            <p>No attendance records yet.</p>
            <small>Records will appear here once your teacher marks attendance.</small>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {courseSummaries.map((cs) => (
              <div key={cs.courseId} className="att-panel">
                <div className="att-panel-head">
                  <div>
                    <p className="att-panel-title">
                      <span className="material-icons">menu_book</span>
                      {cs.courseName}
                    </p>
                    <p className="att-panel-sub">Course ID: {cs.courseId}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <span className="att-chip att-chip--present">
                      <span className="material-icons">check_circle</span>
                      Present: {cs.present}
                    </span>
                    <span className="att-chip att-chip--absent">
                      <span className="material-icons">cancel</span>
                      Absent: {cs.absent}
                    </span>
                    <span className="att-chip att-chip--od">
                      <span className="material-icons">work</span>
                      OD: {cs.od}
                    </span>
                  </div>
                </div>
                <div className="att-panel-body">
                  <ProgressBar attended={cs.present + cs.od} total={cs.total} />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Detailed records table ──────────────────────── */}
      {view === "detail" && (
        records.length === 0 ? (
          <div className="att-empty">
            <span className="material-icons">history</span>
            <p>No records to display.</p>
          </div>
        ) : (
          <div className="att-table-wrap">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Marked By</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td>{formatDate(r.attendanceDate)}</td>
                    <td>{r.courseName || `Course ${r.courseId || "—"}`}</td>
                    <td>
                      <span className={
                        r.status === "PRESENT" ? "att-chip att-chip--present"
                        : r.status === "ABSENT" ? "att-chip att-chip--absent"
                        : r.status === "OD" ? "att-chip att-chip--od"
                        : "att-chip att-chip--neutral"
                      }>
                        <span className="material-icons">
                          {r.status === "PRESENT" ? "check_circle"
                           : r.status === "ABSENT" ? "cancel"
                           : r.status === "OD" ? "work"
                           : "help"}
                        </span>
                        {r.status || "—"}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{r.markedBy || "—"}</td>
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
