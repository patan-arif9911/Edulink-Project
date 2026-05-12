import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    courseApi
      .fetchTeacherClasses()
      .then((res) => {
        setClasses(res.data?.data || res.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch classes:", err);
        setError(parseApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const recentClasses = classes.slice(0, 5);

  return (
    <div className="dashboard-page">
      <SectionHeader title="Teacher Dashboard" subtitle="Manage your classes and students" />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />

      <div className="metrics-grid">
        <MetricCard icon="class" label="My Classes" value={classes.length} color="#1a73e8" />
        <MetricCard icon="schedule" label="Recent Classes" value={recentClasses.length} color="#6a1b9a" />
        <MetricCard icon="people" label="Students" value={classes.reduce((acc, c) => acc + (c.studentCount || 0), 0)} color="#2e7d32" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">My Class List</h3>
          <p className="dashboard-panel-subtitle">Recent classes assigned to you</p>
          {recentClasses.length ? (
            <ul className="dashboard-list">
              {recentClasses.map((item, idx) => (
                <li key={item.id || `${item.classCode || "class"}-${idx}`} className="dashboard-list-item">
                  <span className="dashboard-item-label">{item.className || item.courseName || item.classCode || "Class"}</span>
                  <span className="dashboard-item-meta">{item.schedule || item.section || "Schedule pending"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No classes assigned yet.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Shortcuts for daily workflows</p>
          <div className="dashboard-actions">
            <Link to="/teacher/upload-material" className="dashboard-link-btn">Upload Material</Link>
            <Link to="/teacher/new-assignment" className="dashboard-link-btn">Create Assignment</Link>
            <Link to="/teacher/attendance" className="dashboard-link-btn">Record Attendance</Link>
            <Link to="/teacher/exam-submissions-browser" className="dashboard-link-btn">View Exam Submissions</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
