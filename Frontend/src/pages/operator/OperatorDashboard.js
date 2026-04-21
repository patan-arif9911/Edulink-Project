import React, { useState, useEffect } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function OperatorDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    identityApi
      .fetchAllUsers()
      .then((res) => setUsers(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader title="Operator Dashboard" subtitle="System-level overview" />
      <div className="metrics-grid">
        <MetricCard icon="people" label="Total Users" value={users.length} color="#1a73e8" />
        <MetricCard icon="verified_user" label="Compliance Officers" value={roleCounts.COMPLIANCE_OFFICER || 0} color="#e65100" />
        <MetricCard icon="account_balance" label="Board Officers" value={roleCounts.EDUCATION_BOARD_OFFICER || 0} color="#2e7d32" />
        <MetricCard icon="gavel" label="Regulators" value={roleCounts.REGULATOR || 0} color="#6a1b9a" />
        <MetricCard icon="admin_panel_settings" label="School Admins" value={roleCounts.SCHOOL_ADMIN || 0} color="#c62828" />
        <MetricCard icon="school" label="Teachers" value={roleCounts.TEACHER || 0} color="#00695c" />
        <MetricCard icon="person" label="Students" value={roleCounts.STUDENT || 0} color="#ef6c00" />
      </div>
    </div>
  );
}
