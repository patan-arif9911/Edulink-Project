import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function RegulatorDashboard() {
  const [audit, setAudit] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchSystemAudit()
      .then((res) => setAudit(res.data?.data || res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const recentFindings = Array.isArray(audit.recentFindings)
    ? audit.recentFindings.slice(0, 5)
    : [];

  return (
    <div className="dashboard-page">
      <SectionHeader title="Regulator Dashboard" subtitle="System-wide audit overview" />
      <div className="metrics-grid">
        <MetricCard icon="fact_check" label="Total Audits" value={audit.totalAudits} color="#1a73e8" />
        <MetricCard icon="verified" label="Compliant Schools" value={audit.compliantSchools} color="#2e7d32" />
        <MetricCard icon="warning" label="Non-Compliant" value={audit.nonCompliantSchools} color="#c62828" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Recent Findings</h3>
          <p className="dashboard-panel-subtitle">Latest outcomes from regulator audits</p>
          {recentFindings.length ? (
            <ul className="dashboard-list">
              {recentFindings.map((finding, idx) => (
                <li key={finding.id || `${finding.schoolName || "finding"}-${idx}`} className="dashboard-list-item">
                  <span className="dashboard-item-label">{finding.schoolName || finding.title || "Audit Finding"}</span>
                  <span className="dashboard-item-meta">{finding.status || finding.severity || "Open"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No finding list returned by the audit endpoint.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Open regulator workflow pages</p>
          <div className="dashboard-actions">
            <Link to="/regulator/compliance-reports" className="dashboard-link-btn">Compliance Reports</Link>
            <Link to="/regulator/accreditation" className="dashboard-link-btn">Accreditation</Link>
            <Link to="/regulator/system-audit" className="dashboard-link-btn">Run System Audit</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
