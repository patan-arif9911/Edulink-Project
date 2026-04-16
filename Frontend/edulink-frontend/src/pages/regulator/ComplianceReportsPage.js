import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ComplianceReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchRegulatorComplianceReports()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolId", label: "School ID" },
    { key: "schoolName", label: "School" },
    { key: "status", label: "Status" },
    { key: "remarks", label: "Remarks" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Compliance Reports" subtitle="GET /regulator/compliance-reports" />
      <GenericTable columns={columns} data={data} emptyMessage="No reports found." />
    </div>
  );
}
