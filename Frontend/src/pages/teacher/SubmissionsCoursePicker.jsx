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
        const classData = res.data?.data || res.data || [];
        setClasses(Array.isArray(classData) ? classData : []);
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="View Student Submissions"
        subtitle="Select a class to view submitted assignments and exams"
      />

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {classes.length === 0 && !error ? (
        <div className="empty-state">
          <span className="material-icons-round" style={{ fontSize: 48, color: "#ccc" }}>
            folder_off
          </span>
          <p>No classes assigned to you yet.</p>
        </div>
      ) : (
        <div className="card-grid" style={{ marginTop: "1rem" }}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="metric-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/teacher/submissions/${cls.courseCode || cls.id}`)}
            >
              <span className="material-icons-round" style={{ fontSize: 36, color: "#4361ee" }}>
                assignment
              </span>
              <h4 style={{ margin: "0.5rem 0 0.25rem" }}>{cls.courseCode || `Class ${cls.id}`}</h4>
              <p style={{ color: "#666", fontSize: "0.85rem" }}>
                {cls.className || "Course"}
              </p>
              <span style={{ color: "#4361ee", fontSize: "0.8rem" }}>View Submissions →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
