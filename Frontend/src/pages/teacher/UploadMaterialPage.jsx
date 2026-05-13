import React, { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function UploadMaterialPage() {
  // Cascading dropdowns: class → course. A single selection controls both upload and the listing.
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  // Upload form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialType, setMaterialType] = useState("PDF");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Materials listing for the selected course
  const [materials, setMaterials] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  /* Load the teacher's classes once on mount. */
  useEffect(() => {
    courseApi
      .fetchTeacherClasses()
      .then((res) => setClasses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load classes."))
      .finally(() => setClassesLoading(false));
  }, []);

  /* When class changes, load its courses and clear the selected course. */
  useEffect(() => {
    if (!selectedClassId) {
      setCourses([]);
      setSelectedCourseCode("");
      return;
    }
    setCoursesLoading(true);
    setSelectedCourseCode("");
    courseApi
      .fetchCoursesByClass(selectedClassId)
      .then((res) => setCourses(res.data?.data || res.data || []))
      .catch((err) => setError(parseApiError(err) || "Failed to load courses for this class."))
      .finally(() => setCoursesLoading(false));
  }, [selectedClassId]);

  /* When course changes, fetch the existing materials for that course. */
  useEffect(() => {
    if (!selectedCourseCode) {
      setMaterials([]);
      return;
    }
    fetchMaterials(selectedCourseCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseCode]);

  const fetchMaterials = async (code) => {
    if (!code) return;
    setListLoading(true);
    try {
      const res = await courseApi.fetchTeacherMaterials(code);
      setMaterials(res.data?.data || []);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setListLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedClassId) { setError("Please select a class."); return; }
    if (!selectedCourseCode) { setError("Please select a course."); return; }
    if (!file) { setError("Please select a file."); return; }

    const formData = new FormData();
    formData.append("courseCode", selectedCourseCode);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("materialType", materialType);
    formData.append("file", file);

    setLoading(true);
    try {
      await courseApi.uploadMaterial(formData);
      setSuccess("Material uploaded successfully!");
      // Refresh the materials list — but keep the class/course selection so the teacher can upload more.
      fetchMaterials(selectedCourseCode);
      setTitle("");
      setDescription("");
      setMaterialType("PDF");
      setFile(null);
      const fileInput = document.getElementById("material-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await courseApi.downloadMaterial(selectedCourseCode, fileId);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "material.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const handlePreview = async (fileId) => {
    try {
      const res = await courseApi.downloadMaterial(selectedCourseCode, fileId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await courseApi.deleteMaterial(selectedCourseCode, fileId);
      setSuccess("Material deleted successfully!");
      fetchMaterials(selectedCourseCode);
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "materialType", label: "Type" },
    { key: "fileName", label: "File Name" },
    {
      key: "uploadedAt",
      label: "Uploaded",
      render: (r) => formatDateTime(r.uploadedAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) =>
        r.fileId ? (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {r.materialType === "PDF" && (
              <button
                className="submit-btn"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem", background: "#1a73e8" }}
                onClick={() => handlePreview(r.fileId)}
              >
                Preview
              </button>
            )}
            <button
              className="submit-btn"
              style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
              onClick={() => handleDownload(r.fileId, r.fileName)}
            >
              Download
            </button>
            <button
              className="submit-btn"
              style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem", background: "#d32f2f" }}
              onClick={() => handleDelete(r.fileId)}
            >
              Delete
            </button>
          </div>
        ) : (
          <span style={{ color: "#999" }}>No file</span>
        ),
    },
  ];

  if (classesLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Upload Material" subtitle="Select a class and course, then upload" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">— Select a class —</option>
              {classes.map((c) => (
                <option key={c.id || c.classId} value={c.id || c.classId}>
                  {c.className || `Class ${c.grade || ""}${c.section || ""}`}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <small style={{ color: "#b45309" }}>
                You aren't assigned to any classes yet. Ask your school admin to assign you.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Course</label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              disabled={loading || !selectedClassId || coursesLoading}
              required
            >
              <option value="">
                {!selectedClassId
                  ? "— Select a class first —"
                  : coursesLoading
                    ? "Loading…"
                    : courses.length === 0
                      ? "No courses for this class"
                      : "— Select a course —"}
              </option>
              {courses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseName ? `${c.courseName} (${c.courseCode})` : c.courseCode}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} placeholder="Chapter 1 Notes" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Material Type</label>
            <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} disabled={loading}>
              <option value="PDF">PDF</option>
              <option value="DOCUMENT">Document</option>
              <option value="VIDEO">Video</option>
              <option value="TEXT">Text</option>
            </select>
          </div>
          <div className="form-group">
            <label>File</label>
            <input id="material-file" type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Uploading…" : "Upload Material"}</button>
        </form>
      </div>

      {/* Existing materials for the currently-selected course */}
      <div style={{ marginTop: "2rem" }}>
        <SectionHeader
          title="Uploaded Materials"
          subtitle={selectedCourseCode ? `Materials for ${selectedCourseCode}` : "Pick a class and course above to see existing materials"}
        />
        {listLoading ? (
          <Spinner />
        ) : !selectedCourseCode ? (
          <p className="muted" style={{ padding: "1rem" }}>No course selected.</p>
        ) : (
          <GenericTable
            columns={columns}
            data={materials}
            emptyMessage="No materials uploaded for this course yet."
          />
        )}
      </div>
    </div>
  );
}
