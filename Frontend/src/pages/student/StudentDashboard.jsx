 import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import studentApi from "../../api/studentApi";
import { AuthContext } from "../../context/AuthContext";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import "../../styles/pages.css";

export default function StudentDashboard() {
  const { currentUser } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      studentApi.fetchEnrolledCourses().catch(() => ({ data: { data: [] } })),
      studentApi.fetchGrades().catch(() => ({ data: { data: [] } })),
      studentApi.fetchAttendance().catch(() => ({ data: { data: [] } })),
    ])
      .then(([coursesRes, gradesRes, attendanceRes]) => {
        setCourses(coursesRes.data?.data || []);
        setGrades(gradesRes.data?.data || []);
        setAttendance(attendanceRes.data?.data || []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const presentCount = attendance.filter(
    (a) => a.status === "PRESENT"
  ).length;
  const avgGrade =
    grades.length > 0
      ? (
          grades.reduce((sum, g) => sum + (g.marksObtained || 0), 0) /
          grades.length
        ).toFixed(1)
      : "—";

  const attendanceRate =
    attendance.length > 0
      ? `${Math.round((presentCount / attendance.length) * 100)}%`
      : "—";

  const recentGrades = grades.slice(0, 5);
  const recentCourses = courses.slice(0, 4);
  const recentAttendance = attendance.slice(0, 5);

  const alerts = [
    attendance.length > 0 && presentCount / attendance.length < 0.75
      ? { id: "attendance", message: "Attendance is below 75%.", severity: "warning" }
      : null,
    grades.length === 0
      ? { id: "grades", message: "No grades published yet.", severity: "info" }
      : null,
  ].filter(Boolean);

  return (
    <div className="dashboard-page">
      <SectionHeader
        title={`Welcome, ${currentUser?.fullName || "Student"}`}
        subtitle="Your learning overview"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <div className="metrics-grid">
        <MetricCard
          icon="menu_book"
          label="Enrolled Courses"
          value={courses.length}
          color="#1a73e8"
        />
        <MetricCard
          icon="grade"
          label="Avg Marks"
          value={avgGrade}
          color="#2e7d32"
        />
        <MetricCard
          icon="event_available"
          label="Attendance Rate"
          value={attendanceRate}
          color="#e65100"
        />
        <MetricCard
          icon="assignment"
          label="Exams Graded"
          value={grades.length}
          color="#6a1b9a"
        />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Recent Grades</h3>
          <p className="dashboard-panel-subtitle">Latest graded items from your courses</p>
          {recentGrades.length ? (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Assessment</th>
                    <th>Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGrades.map((g, idx) => {
                    const marks = g.marksObtained ?? g.score;
                    const gradeStatus =
                      typeof marks === "number"
                        ? marks >= 70
                          ? "success"
                          : marks >= 50
                            ? "warning"
                            : "error"
                        : "info";

                    return (
                      <tr key={g.id || `${g.courseCode || "COURSE"}-${idx}`}>
                        <td>{g.courseCode || g.courseName || "—"}</td>
                        <td>{g.examTitle || g.assignmentTitle || "Assessment"}</td>
                        <td>{marks ?? "—"}</td>
                        <td>
                          <span className={`dashboard-chip ${gradeStatus}`}>
                            {marks == null ? "Pending" : "Published"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dashboard-empty">No grade records available yet.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Alerts</h3>
          <p className="dashboard-panel-subtitle">Important updates for your progress</p>
          {alerts.length ? (
            <ul className="dashboard-list">
              {alerts.map((item) => (
                <li key={item.id} className="dashboard-list-item">
                  <span className="dashboard-item-label">{item.message}</span>
                  <span className={`dashboard-chip ${item.severity}`}>{item.severity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No new alerts right now.</p>
          )}
        </section>
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">My Attendance</h3>
          <p className="dashboard-panel-subtitle">Recent attendance records</p>
          {recentAttendance.length ? (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((a, idx) => {
                    const isPresent = a.status === "PRESENT";
                    const coursecode=recentCourses.find(c=>c.courseId===a.courseId)?.courseCode || a.courseCode || "—";
                    return (
                      <tr key={a.id || `att-${idx}`}>
                        <td>{coursecode}</td>
                        <td>{a.date || a.attendanceDate || "—"}</td>
                        <td>
                          <span className={`dashboard-chip ${isPresent ? "success" : "error"}`}>
                            {a.status || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dashboard-empty">No attendance records available yet.</p>
          )}
        </section>
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">My Courses</h3>
          <p className="dashboard-panel-subtitle">Quick look at enrolled courses</p>
          {recentCourses.length ? (
            <ul className="dashboard-list">
              {recentCourses.map((course, idx) => {
                const courseStatus = course.status || course.enrollmentStatus;
                const isDone = courseStatus === "COMPLETED" || courseStatus === "DONE" || courseStatus === "ACTIVE";
                return (
                  <li key={course.courseCode || `${course.title || "course"}-${idx}`} className="dashboard-list-item">
                    <span className="dashboard-item-label">
                      {course.courseCode || "COURSE"} - {course.courseName || course.title || "Untitled Course"}
                    </span>
                    <span className={`dashboard-chip ${isDone ? "success" : "error"}`}>
                      {isDone ? "Active" : "Inactive"}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="dashboard-empty">You are not enrolled in any courses yet.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Jump to your most-used pages</p>
          <div className="dashboard-actions">
            <Link to="/student/courses" className="dashboard-link-btn">View My Courses</Link>
            <Link to="/student/submit-assignment" className="dashboard-link-btn">Submit Assignment</Link>
            <Link to="/student/attendance" className="dashboard-link-btn">Check Attendance</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
