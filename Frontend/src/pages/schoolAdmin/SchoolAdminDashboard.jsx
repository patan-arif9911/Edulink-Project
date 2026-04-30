import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import identityApi from "../../api/identityApi";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import MetricCard from "../../components/shared/MetricCard";
import Spinner from "../../components/shared/Spinner";
import "../../styles/pages.css";

export default function SchoolAdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      identityApi.fetchTeachers().catch(() => ({ data: [] })),
      identityApi.fetchStudents().catch(() => ({ data: [] })),
      courseApi.fetchAdminClasses().catch(() => ({ data: { data: [] } })),
      courseApi.fetchAdminCourses().catch(() => ({ data: { data: [] } })),
    ])
      .then(([tRes, sRes, cRes, coRes]) => {
        setTeachers(tRes.data?.data || tRes.data || []);
        setStudents(sRes.data?.data || sRes.data || []);
        setClasses(cRes.data?.data || []);
        setCourses(coRes.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const recentTeachers = teachers.slice(0, 4);
  const recentStudents = students.slice(0, 4);

  return (
    <div className="dashboard-page">
      <SectionHeader title="School Admin Dashboard" subtitle="Manage your school" />
      <div className="metrics-grid">
        <MetricCard icon="groups" label="Teachers" value={teachers.length} color="#1a73e8" />
        <MetricCard icon="people" label="Students" value={students.length} color="#2e7d32" />
        <MetricCard icon="class" label="Classes" value={classes.length} color="#e65100" />
        <MetricCard icon="menu_book" label="Courses" value={courses.length} color="#6a1b9a" />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Recent Accounts</h3>
          <p className="dashboard-panel-subtitle">Latest teachers and students in your school</p>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {[...recentTeachers, ...recentStudents].map((user, idx) => (
                  <tr key={user.id || user.email || idx}>
                    <td>{user.fullName || user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td>
                      <span className={`dashboard-chip ${user.role === "TEACHER" ? "info" : "success"}`}>
                        {user.role === "TEACHER" ? "Teacher" : "Student"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Quick Actions</h3>
          <p className="dashboard-panel-subtitle">Manage school setup faster</p>
          <div className="dashboard-actions">
            <Link to="/school-admin/add-teacher" className="dashboard-link-btn">Add Teacher</Link>
            <Link to="/school-admin/add-student" className="dashboard-link-btn">Add Student</Link>
            <Link to="/school-admin/add-class" className="dashboard-link-btn">Create Class</Link>
            <Link to="/school-admin/add-course" className="dashboard-link-btn">Create Course</Link>
          </div>
        </section>
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-panel-wide">
          <h3 className="dashboard-panel-title">Available Classes</h3>
          <p className="dashboard-panel-subtitle">Classes in your school</p>
          {classes.length ? (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Grade</th>
                    <th>Section</th>
                    <th>Teacher</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c, idx) => (
                    <tr key={c.id || idx}>
                      <td>{c.className || "—"}</td>
                      <td>{c.grade}</td>
                      <td>{c.section || "—"}</td>
                      <td>{c.teacherEmail || "—"}</td>
                      <td>{c.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="dashboard-empty">No classes created yet.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h3 className="dashboard-panel-title">Available Courses</h3>
          <p className="dashboard-panel-subtitle">Courses in your school</p>
          {courses.length ? (
            <ul className="dashboard-list">
              {courses.map((course, idx) => (
                <li key={course.id || idx} className="dashboard-list-item">
                  <span className="dashboard-item-label">
                    <strong>{course.courseCode}</strong> — {course.courseName || "Untitled"}
                  </span>
                  <span className={`dashboard-chip ${course.active ? "success" : "error"}`}>
                    {course.active ? "Active" : "Inactive"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard-empty">No courses created yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
