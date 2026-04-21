import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div className="auth-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
      <span className="material-icons-round" style={{ fontSize: "4rem", color: "#c62828" }}>
        block
      </span>
      <h2 style={{ margin: "1rem 0 0.5rem" }}>Access Denied</h2>
      <p style={{ color: "#666" }}>You don't have permission to view this page.</p>
      <button
        className="auth-submit-btn"
        style={{ maxWidth: 200, margin: "1.5rem auto 0" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}
