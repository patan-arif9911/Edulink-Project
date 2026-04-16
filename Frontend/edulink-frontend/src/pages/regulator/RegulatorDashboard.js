import React, { useState, useEffect } from "react";
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

  return (
    <div>
      <SectionHeader title="Regulator Dashboard" subtitle="System-wide audit overview" />
      <div className="metrics-grid">
        <MetricCard icon="fact_check" label="Total Audits" value={audit.totalAudits} color="#1a73e8" />
        <MetricCard icon="verified" label="Compliant Schools" value={audit.compliantSchools} color="#2e7d32" />
        <MetricCard icon="warning" label="Non-Compliant" value={audit.nonCompliantSchools} color="#c62828" />
      </div>
    </div>
  );
}
