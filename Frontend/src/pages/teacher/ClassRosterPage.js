import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";

export default function ClassRosterPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi
      .fetchClassStudents(classId)
      .then((res) => setStudents(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "id", label: "Student ID" },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title={`Students — Class ${classId}`} subtitle="GET /teacher/students-by-class" />
      <GenericTable columns={columns} data={students} emptyMessage="No students in this class." />
    </div>
  );
}
