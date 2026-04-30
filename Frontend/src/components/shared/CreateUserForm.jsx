import React, { useState } from "react";
import AlertBanner from "../shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import "../../styles/pages.css";

/**
 * Reusable form for creating users (compliance officer, board officer, regulator, school admin, teacher, student).
 * Props:
 *   - title: form heading
 *   - fields: [{ name, label, type, placeholder, required }]
 *   - onSubmit: async (formData) => response
 *   - successExtractor: (response) => { message, tempPassword }
 */
export default function CreateUserForm({ title, fields, onSubmit, successExtractor, defaultValues }) {
  const [formData, setFormData] = useState(defaultValues || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      /* Clean payload: convert numeric fields, strip empty optional values */
      const cleaned = {};
      fields.forEach((f) => {
        const val = formData[f.name];
        if (val === undefined || val === "") {
          if (f.required === false) return;         // skip empty optional fields
          cleaned[f.name] = f.type === "number" ? null : val;
        } else {
          cleaned[f.name] = f.type === "number" ? Number(val) : val;
        }
      });

      const res = await onSubmit(cleaned);
      const wrapper = res.data;                     // { success, message, data }
      const inner   = wrapper?.data || wrapper;
      if (successExtractor) {
        setResult(successExtractor(inner));
      } else {
        const tempPwd = inner?.temporaryPassword || inner?.tempPassword || inner?.password;
        setResult({
          message: wrapper?.message || inner?.message || "User created successfully!",
          tempPassword: tempPwd,
        });
      }
      setFormData(defaultValues || {});
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-form">
      <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#1a1a2e" }}>{title}</h3>

      <AlertBanner type="error" message={error} onClose={() => setError("")} />

      {result && (
        <div className="temp-password-box">
          <span>{result.message}</span>
          {result.tempPassword && (
            <>
              <span style={{ display: "block", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                Temporary Password:
              </span>
              <strong>{result.tempPassword}</strong>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        {fields.map((f) => (
          <div className="form-group" key={f.name}>
            <label>{f.label}</label>
            {f.options ? (
              <select
                name={f.name}
                value={formData[f.name] || ""}
                onChange={handleChange}
                required={f.required !== false}
                disabled={loading}
              >
                <option value="">{f.placeholder || `— Select ${f.label} —`}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type || "text"}
                placeholder={f.placeholder || ""}
                value={formData[f.name] || ""}
                onChange={handleChange}
                required={f.required !== false}
                disabled={loading}
              />
            )}
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
