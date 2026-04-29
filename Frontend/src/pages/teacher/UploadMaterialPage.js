import React, { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import GenericTable from "../../components/shared/GenericTable";
import Spinner from "../../components/shared/Spinner";
import { parseApiError } from "../../utils/apiErrorParser";
import { formatDateTime } from "../../utils/dateFormatters";
import "../../styles/pages.css";

export default function UploadMaterialPage() {
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialType, setMaterialType] = useState("PDF");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Material listing state
  const [listCourseCode, setListCourseCode] = useState("");
  const [materials, setMaterials] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!file) { setError("Please select a file."); return; }

    const formData = new FormData();
    formData.append("courseCode", courseCode);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("materialType", materialType);
    formData.append("file", file);

    setLoading(true);
    try {
      await courseApi.uploadMaterial(formData);
      setSuccess("Material uploaded successfully!");
      // Auto-refresh list if viewing same course
      if (listCourseCode === courseCode) fetchMaterials(courseCode);
      setCourseCode(""); setTitle(""); setDescription(""); setMaterialType("PDF"); setFile(null);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

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

  const handleFetchMaterials = (e) => {
    e.preventDefault();
    fetchMaterials(listCourseCode);
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await courseApi.downloadMaterial(listCourseCode, fileId);
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
      const res = await courseApi.downloadMaterial(listCourseCode, fileId);
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
      await courseApi.deleteMaterial(listCourseCode, fileId);
      setSuccess("Material deleted successfully!");
      fetchMaterials(listCourseCode);
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

  return (
    <div>
      <SectionHeader title="Upload Material" subtitle="POST /teacher/upload-material" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required disabled={loading} placeholder="MATH101" />
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
            <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Uploading…" : "Upload Material"}</button>
        </form>
      </div>

      {/* ── Material Listing Section ── */}
      <div style={{ marginTop: "2rem" }}>
        <SectionHeader title="Uploaded Materials" subtitle="GET /teacher/materials/{courseCode}" />
        <div className="page-form" style={{ marginBottom: "1rem" }}>
          <form onSubmit={handleFetchMaterials} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Course Code</label>
              <input value={listCourseCode} onChange={(e) => setListCourseCode(e.target.value)} required placeholder="MATH101" />
            </div>
            <button type="submit" className="submit-btn" disabled={listLoading} style={{ marginBottom: "0.1rem" }}>
              {listLoading ? "Loading…" : "Fetch Materials"}
            </button>
          </form>
        </div>
        {listLoading ? (
          <Spinner />
        ) : (
          <GenericTable columns={columns} data={materials} emptyMessage="No materials found. Enter a course code and click Fetch." />
        )}
      </div>
    </div>
  );
}
