import React, { useState } from "react";
import identityApi from "../../api/identityApi";
import SectionHeader from "../../components/shared/SectionHeader";
import AlertBanner from "../../components/shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

export default function RegisterSchoolPage() {
  const [form, setForm] = useState({ id: "", name: "", address: "", phone: "", email: "", principalName: "", establishedDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await identityApi.createSchool(form);
      const data = res.data?.data || res.data;
      setSuccess(data?.message || `School "${form.name}" registered successfully!`);
      setForm({ id: "", name: "", address: "", phone: "", email: "", principalName: "", establishedDate: "" });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Register School" subtitle="POST /compliance/identity/create-school" />
      <div className="page-form">
        <AlertBanner type="error" message={error} onClose={() => setError("")} />
        <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>School ID</label>
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required disabled={loading} placeholder="SCH001" />
          </div>
          <div className="form-group">
            <label>School Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={loading} placeholder="Greenwood High School" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required disabled={loading} placeholder="123 Main St" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required disabled={loading} placeholder="+1-555-0100" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={loading} placeholder="info@school.edu" />
          </div>
          <div className="form-group">
            <label>Principal Name</label>
            <input value={form.principalName} onChange={(e) => setForm({ ...form, principalName: e.target.value })} required disabled={loading} placeholder="Dr. Smith" />
          </div>
          <div className="form-group">
            <label>Established Date</label>
            <input type="date" value={form.establishedDate} onChange={(e) => setForm({ ...form, establishedDate: e.target.value })} required disabled={loading} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Registering…" : "Register School"}</button>
        </form>
      </div>
    </div>
  );
}
