import React from "react";
import "./AlertBanner.css";

export default function AlertBanner({ type = "info", message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert-banner alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}
