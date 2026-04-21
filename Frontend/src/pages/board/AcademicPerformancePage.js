import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function AcademicPerformancePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchAcademicPerformance()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolName", label: "School" },
    { key: "averageScore", label: "Avg Score" },
    { key: "passRate", label: "Pass Rate" },
    { key: "totalStudents", label: "Students" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Academic Performance" subtitle="GET /board/academic-performance" />
      <GenericTable columns={columns} data={data} emptyMessage="No performance data." />
    </div>
  );
}
