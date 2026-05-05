import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function AddCoursePage() {
  const [form, setForm] = useState({ courseCode: "", courseName: "", description: "", classId: "", subject: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const loadCourses = () => {
    setCoursesLoading(true);
    courseApi.fetchAdminCourses()
      .then((res) => {
        setCourses(res.data?.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setError(parseApiError(err));
      })
      .finally(() => setCoursesLoading(false));
  };

  useEffect(() => {
    setClassesLoading(true);
    courseApi.fetchAdminClasses()
      .then((res) => {
        setClasses(res.data?.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch classes:", err);
        setError(parseApiError(err));
      })
      .finally(() => setClassesLoading(false));
    loadCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.classId) {
      setError("Please select a class.");
      return;
    }
    setLoading(true);
    try {
      await courseApi.createCourse({ ...form, classId: Number(form.classId) });
      setSuccess(`Course "${form.courseName}" created successfully!`);
      setForm({ courseCode: "", courseName: "", description: "", classId: "", subject: "" });
      loadCourses();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const courseColumns = [
    { key: "courseCode", label: "Code" },
    { key: "courseName", label: "Course Name" },
    { key: "subject", label: "Subject" },
    { key: "classId", label: "Class ID" },
    {
      key: "active",
      label: "Status",
      render: (r) => (
        <span className={`dashboard-chip ${r.active ? "success" : "error"}`}>
          {r.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (r) => formatDateTime(r.createdAt),
    },
  ];

  return (
    <div>
      <SectionHeader title="Create Course" subtitle="POST course/admin/create-course" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} required disabled={loading} placeholder="MATH101" />
          </div>
          <div className="form-group">
            <label>Course Name</label>
            <input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} required disabled={loading} placeholder="Mathematics" />
          </div>
          <div className="form-group">
            <label>Class</label>
            {classesLoading ? (
              <select disabled><option>Loading classes...</option></select>
            ) : (
              <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required disabled={loading}>
                <option value="">— Select a class —</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className} (Grade {c.grade}, Section {c.section})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required disabled={loading} placeholder="Mathematics" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Course"}</button>
        </form>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <SectionHeader title="Available Courses" subtitle="Courses in your school" />
        {coursesLoading ? <Spinner /> : (
          <GenericTable columns={courseColumns} data={courses} emptyMessage="No courses created yet." />
        )}
      </div>
    </div>
  );
}
