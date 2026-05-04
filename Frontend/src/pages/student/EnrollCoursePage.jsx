import React, { useState, useEffect } from "react";
import studentApi from "../../api/studentApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function EnrollCoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    studentApi
      .fetchAvailableCourses()
      .then((res) => setCourses(res.data?.data || []))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseCode, courseName) => {
    setError("");
    setSuccess("");
    setEnrolling(courseCode);
    try {
      await studentApi.enrollCourse(courseCode);
      setSuccess(`Successfully enrolled in ${courseName}!`);
      // Remove the enrolled course from the available list
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.courseCode !== courseCode)
      );
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setEnrolling(null);
    }
  };

  const columns = [
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course Name" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <button
          className="submit-btn"
          style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
          onClick={() => handleEnroll(r.courseCode, r.courseName)}
          disabled={enrolling !== null}
        >
          {enrolling === r.courseCode ? "Enrolling..." : "Enroll"}
        </button>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Enroll in Courses"
        subtitle="Browse and enroll in available courses"
      />
      <AlertBanner type="error" message={error} onClose={() => setError("")} />
      <AlertBanner
        type="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      <GenericTable
        columns={columns}
        data={courses}
        emptyMessage="No available courses to enroll in. You are already enrolled in all courses."
      />
    </div>
  );
}

