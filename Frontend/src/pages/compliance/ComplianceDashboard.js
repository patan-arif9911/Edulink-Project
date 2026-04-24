import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import complianceApi from "../../api/complianceApi";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function ComplianceDashboard() {
  const [stats, setStats] = useState({});
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      complianceApi.fetchComplianceStatus().catch(() => ({ data: {} })),
      identityApi.fetchAllSchools().catch(() => ({ data: [] })),
      complianceApi.fetchAuditRecords().catch(() => ({ data: [] })),
    ])
      .then(([statusRes, schoolsRes, auditsRes]) => {
        const schools = schoolsRes.data?.data || schoolsRes.data || [];
        const audits = auditsRes.data?.data || auditsRes.data || [];
        setStats({
          totalSchools: schools.length,
          totalAudits: audits.length,
          compliant: audits.filter((a) => a.compliant || a.status === "COMPLIANT").length,
        });
        setRecentAudits(audits.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-page">
      <SectionHeader title="Compliance Dashboard" subtitle="Overview of compliance activities" />
      <div className="metrics-grid">
        <MetricCard icon="school" label="Registered Schools" value={stats.totalSchools} color="#1a73e8" />
        <MetricCard icon="fact_check" label="Total Audits" value={stats.totalAudits} color="#e65100" />
        <MetricCard icon="verified" label="Compliant" value={stats.compliant} color="#2e7d32" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Recent Audits</h3>
          <p className="dashboard-panel-subtitle">Latest compliance checks and their statuses</p>
          {recentAudits.length ? (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAudits.map((audit, idx) => {
                    const status = audit.status || (audit.compliant ? "COMPLIANT" : "PENDING");
                    const statusClass =
                      status === "COMPLIANT"
                        ? "success"
                        : status === "NON_COMPLIANT"
                          ? "error"
                          : "warning";

                    return (
                      <tr key={audit.id || `${audit.schoolName || "audit"}-${idx}`}>
                        <td>{audit.schoolName || audit.school || "—"}</td>
                        <td>{audit.auditDate || audit.createdAt || "—"}</td>
                        <td>
                          <span className={`dashboard-chip ${statusClass}`}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dashboard-empty">No audit records available.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Common tasks for compliance operations</p>
          <div className="dashboard-actions">
            <Link to="/compliance/register-school" className="dashboard-link-btn">Register School</Link>
            <Link to="/compliance/add-school-admin" className="dashboard-link-btn">Add School Admin</Link>
            <Link to="/compliance/audit" className="dashboard-link-btn">Start Audit</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
