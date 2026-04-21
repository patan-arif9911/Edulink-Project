import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";
import { formatDate } from "../../utils/dateFormatters";

export default function AttendanceReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi
      .fetchAttendanceReport()
      .then((res) => {
        const d = res.data?.data || res.data;
        setData(Array.isArray(d) ? d : [d]);
      })
      .catch(() => {})
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
      <SectionHeader title="Attendance Report" subtitle="GET /admin/attendance-report" />
      <GenericTable columns={columns} data={data} emptyMessage="No attendance records." />
    </div>
  );
}
