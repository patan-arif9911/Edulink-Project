import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";
import { formatDateTime } from "../../utils/dateFormatters";

export default function ViewAuditRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchAuditRecords()
      .then((res) => setRecords(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolId", label: "School ID" },
    { key: "auditorEmail", label: "Auditor" },
    { key: "remarks", label: "Remarks" },
    { key: "compliant", label: "Compliant", render: (r) => (r.compliant ? "Yes" : "No") },
    { key: "auditDate", label: "Date", render: (r) => formatDateTime(r.auditDate || r.createdAt) },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Audit Records" subtitle="GET /compliance/audit-records" />
      <GenericTable columns={columns} data={records} emptyMessage="No audit records found." />
    </div>
  );
}
