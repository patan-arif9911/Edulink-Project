import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function ComplianceDashboard() {
  const [stats, setStats] = useState({});
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
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Compliance Dashboard" subtitle="Overview of compliance activities" />
      <div className="metrics-grid">
        <MetricCard icon="school" label="Registered Schools" value={stats.totalSchools} color="#1a73e8" />
        <MetricCard icon="fact_check" label="Total Audits" value={stats.totalAudits} color="#e65100" />
        <MetricCard icon="verified" label="Compliant" value={stats.compliant} color="#2e7d32" />
      </div>
    </div>
  );
}
