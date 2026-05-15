import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import { required, validateForm, hasErrors } from "../../utils/formValidators";
import "../../styles/pages.css";

export default function AddCoursePage() {
  const [form, setForm] = useState({ courseCode: "", courseName: "", description: "", classId: "", subject: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
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

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    // Per-field validation — all four are required; description is optional.
    const errs = validateForm(form, {
      courseCode: [(v) => required(v, "Course Code")],
      courseName: [(v) => required(v, "Course Name")],
      classId:    [(v) => required(v, "Class")],
      subject:    [(v) => required(v, "Subject")],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      setError("Please fix the highlighted fields and try again.");
      return;
    }
    setFieldErrors({});
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
      <SectionHeader title="Create Course" subtitle="Create a new course" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Course Code<span className="req-asterisk"> *</span></label>
            <input
              value={form.courseCode}
              onChange={(e) => updateField("courseCode", e.target.value)}
              disabled={loading}
              placeholder="MATH101"
              className={fieldErrors.courseCode ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.courseCode}
            />
            {fieldErrors.courseCode && <small className="field-error">{fieldErrors.courseCode}</small>}
          </div>
          <div className="form-group">
            <label>Course Name<span className="req-asterisk"> *</span></label>
            <input
              value={form.courseName}
              onChange={(e) => updateField("courseName", e.target.value)}
              disabled={loading}
              placeholder="Mathematics"
              className={fieldErrors.courseName ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.courseName}
            />
            {fieldErrors.courseName && <small className="field-error">{fieldErrors.courseName}</small>}
          </div>
          <div className="form-group">
            <label>Class<span className="req-asterisk"> *</span></label>
            {classesLoading ? (
              <select disabled><option>Loading classes...</option></select>
            ) : (
              <select
                value={form.classId}
                onChange={(e) => updateField("classId", e.target.value)}
                disabled={loading}
                className={fieldErrors.classId ? "input-invalid" : ""}
                aria-invalid={!!fieldErrors.classId}
              >
                <option value="">— Select a class —</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.className} (Grade {c.grade}, Section {c.section})
                  </option>
                ))}
              </select>
            )}
            {fieldErrors.classId && <small className="field-error">{fieldErrors.classId}</small>}
          </div>
          <div className="form-group">
            <label>Subject<span className="req-asterisk"> *</span></label>
            <input
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              disabled={loading}
              placeholder="Mathematics"
              className={fieldErrors.subject ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.subject}
            />
            {fieldErrors.subject && <small className="field-error">{fieldErrors.subject}</small>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} disabled={loading} />
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
