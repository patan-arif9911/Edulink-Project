import React, { useState, useEffect } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function RegisteredSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi
      .fetchBoardSchools()
      .then((res) => setSchools(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "schoolId", label: "School ID" },
    { key: "schoolName", label: "School Name" },
    { key: "address", label: "Address" },
    { key: "contactEmail", label: "Contact" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Registered Schools" subtitle="GET /board/schools" />
      <GenericTable columns={columns} data={schools} emptyMessage="No schools registered." />
    </div>
  );
}
