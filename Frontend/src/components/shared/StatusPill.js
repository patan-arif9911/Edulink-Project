import React from "react";
import "./StatusPill.css";

const STATUS_MAP = {
  PRESENT: { type: "success", label: "Present" },
  ABSENT: { type: "error", label: "Absent" },
  LATE: { type: "warning", label: "Late" },
  EXCUSED: { type: "info", label: "Excused" },
  COMPLETED: { type: "success", label: "Completed" },
  DONE: { type: "success", label: "Done" },
  ACTIVE: { type: "success", label: "Active" },
  INACTIVE: { type: "error", label: "Inactive" },
  PENDING: { type: "warning", label: "Pending" },
};

export default function StatusPill({ label, type, status }) {
  // Auto-resolve from status string if label/type not explicitly provided
  const resolved = status ? STATUS_MAP[status] || { type: "default", label: status } : {};
  const finalLabel = label || resolved.label || "—";
  const finalType = type || resolved.type || "default";

  return (
    <span className={`status-pill status-pill--${finalType}`}>
      {finalLabel}
    </span>
  );
}
