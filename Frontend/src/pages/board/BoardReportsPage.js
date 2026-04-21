import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function BoardReportsPage() {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchBoardReports()
      .then((res) => setReport(res.data?.data || res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Board Reports" subtitle="GET /board/reports" />
      <div className="metrics-grid">
        <MetricCard icon="school" label="Total Schools" value={report.totalSchools} color="#1a73e8" />
        <MetricCard icon="people" label="Total Students" value={report.totalStudents} color="#2e7d32" />
        <MetricCard icon="groups" label="Total Teachers" value={report.totalTeachers} color="#e65100" />
      </div>
    </div>
  );
}
