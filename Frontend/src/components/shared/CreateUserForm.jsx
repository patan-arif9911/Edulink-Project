import React, { useState } from "react";
import AlertBanner from "../shared/AlertBanner";
import { parseApiError } from "../../utils/apiErrorParser";
import { required, email as emailValidator, validateForm, hasErrors } from "../../utils/formValidators";
import "../../styles/pages.css";


/**
 * Reusable form for creating users (compliance officer, board officer, regulator, school admin, teacher, student).
 * Props:
 *   - title: form heading
 *   - fields: [{ name, label, type, placeholder, required }]
 *   - onSubmit: async (formData) => response
 *   - successExtractor: (response) => { message, tempPassword }
 *
 * Validation:
 *   - All fields are required by default; pass `required: false` on a field to make it optional.
 *   - Fields with type="email" must also pass an email format check.
 *   - Validation runs on submit and renders inline error messages beneath each invalid field.
 */
export default function CreateUserForm({ title, fields, onSubmit,validate, successExtractor, defaultValues }) {
  const [formData, setFormData] = useState(defaultValues || {});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the inline error for this field as the user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  /** Build the rules map for validateForm from the field specs. */
  const buildRules = () => {
    const rules = {};
    fields.forEach((f) => {
      const list = [];
      if (f.required !== false) {
        list.push((v) => required(v, f.label || f.name));
      }
      if (f.type === "email") {
        list.push(emailValidator);
      }
      if (list.length) rules[f.name] = list;
    });
    return rules;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Per-field validation first — show inline messages, no API call if any fail
    const errs = validateForm(formData, buildRules());
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      setError("Please fix the highlighted fields and try again.");
      return;
    }
    setFieldErrors({});
    setLoading(true);
    
    
    if (validate && !validate(formData)) {
      setLoading(false); 
      return;
    }


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
        setResult({ message: "User created successfully!" });
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

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }} noValidate>
        {fields.map((f) => {
          const isRequired = f.required !== false;
          const fieldErr = fieldErrors[f.name];
          return (
            <div className="form-group" key={f.name}>
              <label>
                {f.label}
                {isRequired && <span className="req-asterisk"> *</span>}
              </label>
              {f.options ? (
                <select
                  name={f.name}
                  value={formData[f.name] || ""}
                  onChange={handleChange}
                  disabled={loading}
                  className={fieldErr ? "input-invalid" : ""}
                  aria-invalid={!!fieldErr}
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
                  disabled={loading}
                  className={fieldErr ? "input-invalid" : ""}
                  aria-invalid={!!fieldErr}
                />
              )}
              {fieldErr && <small className="field-error">{fieldErr}</small>}
            </div>
          );
        })}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
