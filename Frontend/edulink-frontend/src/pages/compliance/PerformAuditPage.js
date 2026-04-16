import React, { useState } from "react";
import complianceApi from "../../api/complianceApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function PerformAuditPage() {
  const [form, setForm] = useState({ schoolId: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await complianceApi.auditSchool(form);
      setSuccess(res.data?.message || res.data?.data?.message || "Audit submitted successfully!");
      setForm({ schoolId: "", remarks: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Audit School" subtitle="POST /compliance/audit-school" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>School ID</label>
            <input value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required disabled={loading} placeholder="SCH001" />
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea rows={4} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} disabled={loading} placeholder="Audit observations…" />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Submitting…" : "Submit Audit"}</button>
        </form>
      </div>
    </div>
  );
}
