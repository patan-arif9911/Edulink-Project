import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function OperatorDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    identityApi
      .fetchAllUsers()
      .then((res) => {
        setUsers(res.data?.data || res.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError(parseApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const roleRows = [
    { key: "COMPLIANCE_OFFICER", label: "Compliance Officers" },
    { key: "EDUCATION_BOARD_OFFICER", label: "Board Officers" },
    { key: "REGULATOR", label: "Regulators" },
    { key: "SCHOOL_ADMIN", label: "School Admins" },
    { key: "TEACHER", label: "Teachers" },
    { key: "STUDENT", label: "Students" },
  ];

  return (
    <div className="dashboard-page">
      <SectionHeader title="Operator Dashboard" subtitle="System-level overview" />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />
      {/* metric cards */}
      <div className="metrics-grid">
        <MetricCard icon="people" label="Total Users" value={users.length} color="#1a73e8" />
        <MetricCard icon="verified_user" label="Compliance Officers" value={roleCounts.COMPLIANCE_OFFICER || 0} color="#e65100" />
        <MetricCard icon="account_balance" label="Board Officers" value={roleCounts.EDUCATION_BOARD_OFFICER || 0} color="#2e7d32" />
        <MetricCard icon="gavel" label="Regulators" value={roleCounts.REGULATOR || 0} color="#6a1b9a" />
        <MetricCard icon="admin_panel_settings" label="School Admins" value={roleCounts.SCHOOL_ADMIN || 0} color="#c62828" />
        <MetricCard icon="school" label="Teachers" value={roleCounts.TEACHER || 0} color="#00695c" />
        <MetricCard icon="person" label="Students" value={roleCounts.STUDENT || 0} color="#ef6c00" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Users by Role</h3>
          <p className="dashboard-panel-subtitle">Distribution of accounts across the platform</p>
          <ul className="dashboard-list">
            {roleRows.map((role) => (
              <li key={role.key} className="dashboard-list-item">
                <span className="dashboard-item-label">{role.label}</span>
                <span className="dashboard-chip info">{roleCounts[role.key] || 0}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Shortcuts to user onboarding pages</p>
          <div className="dashboard-actions">
            <Link to="/operator/add-compliance-officer" className="dashboard-link-btn">Add Compliance Officer</Link>
            <Link to="/operator/add-board-officer" className="dashboard-link-btn">Add Board Officer</Link>
            <Link to="/operator/add-regulator" className="dashboard-link-btn">Add Regulator</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
