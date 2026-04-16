import React from "react";
import "./MetricCard.css";

export default function MetricCard({ icon, label, value, color = "#1a73e8" }) {
  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <span className="material-icons-round metric-icon" style={{ color }}>
        {icon}
      </span>
      <div className="metric-info">
        <span className="metric-value">{value ?? "—"}</span>
        <span className="metric-label">{label}</span>
      </div>
    </div>
  );
}
