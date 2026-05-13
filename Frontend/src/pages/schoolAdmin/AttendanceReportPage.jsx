import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDate } from "../../utils/dateFormatters";

export default function AttendanceReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    courseApi
      .fetchAttendanceReport()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch attendance report:", err);
        setError(parseApiError(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "studentName", label: "Student" },
    { key: "courseCode", label: "Course" },
    { key: "date", label: "Date", render: (r) => formatDate(r.date) },
    { key: "status", label: "Status" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Attendance Report" subtitle="View attendance records for all students." />
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError("")}
      />
      <GenericTable
        columns={columns}
        data={data}
        emptyMessage="No attendance records."
        pageSize={10}
      />
    </div>
  );
}
