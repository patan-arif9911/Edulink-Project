import React, { useState, useEffect } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import StatusPill from "../../components/shared/StatusPill";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDate } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function ViewAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    studentApi
      .fetchAttendance()
      .then((res) => setRecords(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  /* Backend response fields per record (from attendance-service):
     id, studentId, courseId, schoolId, attendanceDate, status,
     markedBy, createdAt */
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const totalRecords = records.length;

  const columns = [
    {
      key: "attendanceDate",
      label: "Date",
      render: (r) => formatDate(r.attendanceDate),
    },
    { key: "courseId", label: "Course ID" },
    { key: "schoolId", label: "School" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusPill status={r.status} />,
    },
    { key: "markedBy", label: "Marked By" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="My Attendance"
        subtitle="Attendance records from all courses"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {totalRecords > 0 && (
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <span>
            <strong>Total:</strong> {totalRecords}
          </span>
          <span style={{ color: "#2e7d32" }}>
            <strong>Present:</strong> {presentCount}
          </span>
          <span style={{ color: "#c62828" }}>
            <strong>Absent:</strong> {absentCount}
          </span>
          <span>
            <strong>Attendance %:</strong>{" "}
            {totalRecords > 0
              ? ((presentCount / totalRecords) * 100).toFixed(1) + "%"
              : "—"}
          </span>
        </div>
      )}

      <GenericTable
        columns={columns}
        data={records}
        emptyMessage="No attendance records yet."
      />
    </div>
  );
}
