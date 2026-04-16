import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function AccreditationPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchAccreditationStatus()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolName", label: "School" },
    { key: "accreditationStatus", label: "Status" },
    { key: "accreditedUntil", label: "Valid Until" },
    { key: "grade", label: "Grade" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Accreditation Status" subtitle="GET /regulator/accreditation-status" />
      <GenericTable columns={columns} data={data} emptyMessage="No accreditation data." />
    </div>
  );
}
