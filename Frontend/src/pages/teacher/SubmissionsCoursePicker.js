import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import Spinner from "../../components/shared/Spinner";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function SubmissionsCoursePicker() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setClasses(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  // Build unique course list from classes
  const courseMap = {};
  classes.forEach((c) => {
    const code = c.courseCode || c.courseId;
    if (code && !courseMap[code]) {
      courseMap[code] = {
        courseCode: code,
        className: c.className || c.courseName || code,
      };
    }
  });
  const courses = Object.values(courseMap);

  return (
    <div>
      <SectionHeader
        title="View Student Submissions"
        subtitle="Select a course to view submitted assignments"
      />

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {courses.length === 0 && !error ? (
        <div className="empty-state">
          <span className="material-icons-round" style={{ fontSize: 48, color: "#ccc" }}>
            folder_off
          </span>
          <p>No courses found. You need assigned classes first.</p>
        </div>
      ) : (
        <div className="card-grid" style={{ marginTop: "1rem" }}>
          {courses.map((c) => (
            <div
              key={c.courseCode}
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/teacher/submissions/${c.courseCode}`)}
            >
              <span className="material-icons-round" style={{ fontSize: 36, color: "#4361ee" }}>
                assignment
              </span>
              <h4 style={{ margin: "0.5rem 0 0.25rem" }}>{c.courseCode}</h4>
              <p style={{ color: "#666", fontSize: "0.85rem" }}>{c.className}</p>
              <span style={{ color: "#4361ee", fontSize: "0.8rem" }}>View Submissions →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
