import React from "react";
import "./StatusPill.css";

const typeColors = {
  success: "#1e7e34",
  warning: "#e65100",
  error: "#c62828",
  info: "#1a73e8",
  default: "#666",
};

export default function StatusPill({ label, type = "default" }) {
  const color = typeColors[type] || typeColors.default;
  return (
    <span className="status-pill" style={{ color, borderColor: color }}>
      {label}
    </span>
  );
}
