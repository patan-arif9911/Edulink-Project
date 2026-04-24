import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function BoardDashboard() {
  const [stats, setStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchBoardReports()
      .then((res) => {
        const d = res.data?.data || res.data || {};
        setStats(d);
        setRecentReports(Array.isArray(d.recentReports) ? d.recentReports.slice(0, 5) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-page">
      <SectionHeader title="Board Dashboard" subtitle="Education Board oversight" />
      <div className="metrics-grid">
        <MetricCard icon="school" label="Total Schools" value={stats.totalSchools} color="#1a73e8" />
        <MetricCard icon="people" label="Total Students" value={stats.totalStudents} color="#2e7d32" />
        <MetricCard icon="groups" label="Total Teachers" value={stats.totalTeachers} color="#e65100" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Recent Board Reports</h3>
          <p className="dashboard-panel-subtitle">Latest submissions reviewed by the board</p>
          {recentReports.length ? (
            <ul className="dashboard-list">
              {recentReports.map((report, idx) => (
                <li key={report.id || `${report.title || "report"}-${idx}`} className="dashboard-list-item">
                  <span className="dashboard-item-label">{report.title || report.reportName || "Report"}</span>
                  <span className="dashboard-item-meta">{report.period || report.createdAt || "Recent"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No recent report list returned by the API.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Navigate to board monitoring pages</p>
          <div className="dashboard-actions">
            <Link to="/board/schools" className="dashboard-link-btn">View Schools</Link>
            <Link to="/board/performance" className="dashboard-link-btn">Academic Performance</Link>
            <Link to="/board/reports" className="dashboard-link-btn">Open Reports</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
