import React, { useState } from "react";
import courseApi from "../../api/courseApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
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
      setCourseCode(""); setTitle(""); setDescription(""); setMaterialType("PDF"); setFile(null);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

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
              <option value="TEXT">Text</option>
            </select>
          </div>
          <div className="form-group">
            <label>File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Uploading…" : "Upload Material"}</button>
        </form>
      </div>
    </div>
  );
}
