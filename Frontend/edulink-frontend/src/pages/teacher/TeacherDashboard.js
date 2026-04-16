import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Teacher Dashboard" subtitle="Manage your classes and students" />
      <div className="metrics-grid">
        <MetricCard icon="class" label="My Classes" value={classes.length} color="#1a73e8" />
      </div>
    </div>
  );
}
