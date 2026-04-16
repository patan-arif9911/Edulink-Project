import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function SchoolAdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      identityApi.fetchTeachers().catch(() => ({ data: [] })),
      identityApi.fetchStudents().catch(() => ({ data: [] })),
    ])
      .then(([tRes, sRes]) => {
        setTeachers(tRes.data?.data || tRes.data || []);
        setStudents(sRes.data?.data || sRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="School Admin Dashboard" subtitle="Manage your school" />
      <div className="metrics-grid">
        <MetricCard icon="groups" label="Teachers" value={teachers.length} color="#1a73e8" />
        <MetricCard icon="people" label="Students" value={students.length} color="#2e7d32" />
      </div>
    </div>
  );
}
