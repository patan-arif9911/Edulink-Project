import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function BoardDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchBoardReports()
      .then((res) => {
        const d = res.data?.data || res.data || {};
        setStats(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Board Dashboard" subtitle="Education Board oversight" />
      <div className="metrics-grid">
        <MetricCard icon="school" label="Total Schools" value={stats.totalSchools} color="#1a73e8" />
        <MetricCard icon="people" label="Total Students" value={stats.totalStudents} color="#2e7d32" />
        <MetricCard icon="groups" label="Total Teachers" value={stats.totalTeachers} color="#e65100" />
      </div>
    </div>
  );
}
