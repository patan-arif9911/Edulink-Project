import React from "react";
import "./Spinner.css";

export default function Spinner({ fullScreen = false }) {
  return (
    <div className={`spinner-container ${fullScreen ? "spinner-fullscreen" : ""}`}>
      <div className="spinner" />
    </div>
  );
}
