import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";

export default function ClassRosterPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    courseApi
      .fetchClassStudents(classId)
      .then((res) => setStudents(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, [classId]);

  const columns = [
    { key: "fullName", label: "Student Name" },
    { key: "email", label: "Email" },
    { key: "rollNumber", label: "Roll Number" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title={`Students — Class ${classId}`} subtitle={`Total: ${students.length} student(s)`} />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <GenericTable columns={columns} data={students} emptyMessage="No students found in this class." />
    </div>
  );
}
