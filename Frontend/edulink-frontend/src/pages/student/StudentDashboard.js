import React, { useState, useEffect, useContext } from "react";
import studentApi from "../../api/studentApi";
import { AuthContext } from "../../context/AuthContext";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import "../../styles/pages.css";

export default function StudentDashboard() {
  const { currentUser } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      studentApi.fetchEnrolledCourses().catch(() => ({ data: { data: [] } })),
      studentApi.fetchGrades().catch(() => ({ data: { data: [] } })),
      studentApi.fetchAttendance().catch(() => ({ data: { data: [] } })),
    ])
      .then(([coursesRes, gradesRes, attendanceRes]) => {
        setCourses(coursesRes.data?.data || []);
        setGrades(gradesRes.data?.data || []);
        setAttendance(attendanceRes.data?.data || []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const presentCount = attendance.filter(
    (a) => a.status === "PRESENT"
  ).length;
  const avgGrade =
    grades.length > 0
      ? (
          grades.reduce((sum, g) => sum + (g.marksObtained || 0), 0) /
          grades.length
        ).toFixed(1)
      : "—";

  return (
    <div>
      <SectionHeader
        title={`Welcome, ${currentUser?.fullName || "Student"}`}
        subtitle="Your learning overview"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <div className="metrics-grid">
        <MetricCard
          icon="menu_book"
          label="Enrolled Courses"
          value={courses.length}
          color="#1a73e8"
        />
        <MetricCard
          icon="grade"
          label="Avg Marks"
          value={avgGrade}
          color="#2e7d32"
        />
        <MetricCard
          icon="event_available"
          label="Days Present"
          value={presentCount}
          color="#e65100"
        />
        <MetricCard
          icon="assignment"
          label="Exams Graded"
          value={grades.length}
          color="#6a1b9a"
        />
      </div>
    </div>
  );
}
