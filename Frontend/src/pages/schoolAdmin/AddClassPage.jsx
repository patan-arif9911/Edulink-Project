import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import GenericTable from "../../components/shared/GenericTable";
import AlertBanner from "../../components/shared/AlertBanner";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import { required, email as emailValidator, number, validateForm, hasErrors } from "../../utils/formValidators";
import "../../styles/pages.css";

export default function AddClassPage() {
  const [form, setForm] = useState({ grade: "", section: "", teacherEmail: "", capacity: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdClass, setCreatedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const loadClasses = () => {
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
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Auto-generate classId and className from grade + section
  const classId = form.grade && form.section ? `${form.grade}${form.section.toUpperCase()}` : "";
  const className = classId ? `Class ${classId}` : "";

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
    setError(""); setSuccess(""); setCreatedClass(null);

    // Per-field validation — all four fields required; grade 1–12; capacity ≥ 1; section must be letter(s).
    const errs = validateForm(form, {
      grade:        [(v) => required(v, "Grade"), (v) => number(v, 1, 12)],
      section:      [
        (v) => required(v, "Section"),
        (v) => /^[A-Za-z]{1,2}$/.test(String(v).trim()) ? null : "Section must be 1–2 letters (e.g. A or AB).",
      ],
      teacherEmail: [(v) => required(v, "Teacher Email"), emailValidator],
      capacity:     [(v) => required(v, "Capacity"), (v) => number(v, 1, 500)],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      setError("Please fix the highlighted fields and try again.");
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await courseApi.createClass({
        grade: Number(form.grade),
        section: form.section.toUpperCase(),
        teacherEmail: form.teacherEmail.trim(),
        capacity: Number(form.capacity) || 0,
      });
      const data = res.data?.data;
      setCreatedClass(data);
      setSuccess(`Class "${data?.className || className}" created successfully!`);
      setForm({ grade: "", section: "", teacherEmail: "", capacity: "" });
      loadClasses();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const classColumns = [
    { key: "className", label: "Class Name" },
    { key: "grade", label: "Grade" },
    { key: "section", label: "Section" },
    { key: "teacherEmail", label: "Teacher" },
    { key: "capacity", label: "Capacity" },
    {
      key: "createdAt",
      label: "Created",
      render: (r) => formatDateTime(r.createdAt),
    },
  ];

  return (
    <div>
      <SectionHeader title="Create Class" subtitle="Create a new class" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Grade<span className="req-asterisk"> *</span></label>
            <input
              type="number"
              value={form.grade}
              onChange={(e) => updateField("grade", e.target.value)}
              disabled={loading}
              placeholder="10"
              min="1"
              max="12"
              className={fieldErrors.grade ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.grade}
            />
            {fieldErrors.grade && <small className="field-error">{fieldErrors.grade}</small>}
          </div>
          <div className="form-group">
            <label>Section<span className="req-asterisk"> *</span></label>
            <input
              value={form.section}
              onChange={(e) => updateField("section", e.target.value.toUpperCase())}
              disabled={loading}
              placeholder="A"
              maxLength={2}
              className={fieldErrors.section ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.section}
            />
            {fieldErrors.section && <small className="field-error">{fieldErrors.section}</small>}
          </div>
          {classId && (
            <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#e8f5e9", borderRadius: "6px", fontSize: "0.9rem" }}>
              <strong>Auto-generated:</strong> Class ID = <code>{classId}</code> &nbsp;|&nbsp; Class Name = <code>{className}</code>
            </div>
          )}
          {createdClass && (
            <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "#e3f2fd", borderRadius: "6px", fontSize: "0.9rem", border: "1px solid #90caf9" }}>
              <strong>✅ Created Class Details:</strong><br />
              <span>DB ID: <code>{createdClass.id}</code></span> &nbsp;|&nbsp;
              <span>Class ID: <code>{createdClass.grade}{createdClass.section}</code></span> &nbsp;|&nbsp;
              <span>Class Name: <code>{createdClass.className}</code></span> &nbsp;|&nbsp;
              <span>Grade: <code>{createdClass.grade}</code></span> &nbsp;|&nbsp;
              <span>Section: <code>{createdClass.section}</code></span>
            </div>
          )}
          <div className="form-group">
            <label>Teacher Email<span className="req-asterisk"> *</span></label>
            <input
              type="email"
              value={form.teacherEmail}
              onChange={(e) => updateField("teacherEmail", e.target.value)}
              disabled={loading}
              placeholder="teacher@school.edu"
              className={fieldErrors.teacherEmail ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.teacherEmail}
            />
            {fieldErrors.teacherEmail && <small className="field-error">{fieldErrors.teacherEmail}</small>}
          </div>
          <div className="form-group">
            <label>Capacity<span className="req-asterisk"> *</span></label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              disabled={loading}
              placeholder="35"
              min="1"
              className={fieldErrors.capacity ? "input-invalid" : ""}
              aria-invalid={!!fieldErrors.capacity}
            />
            {fieldErrors.capacity && <small className="field-error">{fieldErrors.capacity}</small>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating…" : "Create Class"}</button>
        </form>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <SectionHeader title="Available Classes" subtitle="Classes in your school" />
        {classesLoading ? <Spinner /> : (
          <GenericTable columns={classColumns} data={classes} emptyMessage="No classes created yet." />
        )}
      </div>
    </div>
  );
}
