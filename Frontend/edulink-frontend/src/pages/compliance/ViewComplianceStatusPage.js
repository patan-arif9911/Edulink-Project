import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ViewComplianceStatusPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchComplianceStatus()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolId", label: "School ID" },
    { key: "schoolName", label: "School Name" },
    { key: "status", label: "Status" },
    { key: "lastAuditDate", label: "Last Audit" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Compliance Status" subtitle="GET /compliance/compliance-status" />
      <GenericTable columns={columns} data={data} emptyMessage="No compliance data." />
    </div>
  );
}
