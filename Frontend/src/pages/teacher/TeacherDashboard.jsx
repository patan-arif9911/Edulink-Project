import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const recentClasses = classes.slice(0, 5);

  return (
    <div className="dashboard-page">
      <SectionHeader title="Teacher Dashboard" subtitle="Manage your classes and students" />
      <div className="metrics-grid">
        <MetricCard icon="class" label="My Classes" value={classes.length} color="#1a73e8" />
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
          </div>
        </section>
      </div>
    </div>
  );
}
