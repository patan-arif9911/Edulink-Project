import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
      <span className="material-icons-round" style={{ fontSize: "5rem", color: "#ccc" }}>
        search_off
      </span>
      <h2 style={{ margin: "1rem 0 0.5rem", color: "#333" }}>404 — Page Not Found</h2>
      <p style={{ color: "#777" }}>The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.5rem",
          background: "#667eea",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.95rem",
        }}
      >
        Go Home
      </button>
    </div>
  );
}
