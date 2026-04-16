import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRoleLabel } from "../config/roles";
import "./TopBar.css";

export default function TopBar({ user }) {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-greeting">
          Welcome, <span>{user?.fullName || user?.email || "User"}</span>
        </h1>
      </div>
      <div className="topbar-right">
        <button
          className="topbar-icon-btn"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <span className="material-icons-round">notifications</span>
        </button>
        <div className="topbar-user-info">
          <span className="topbar-role">{getRoleLabel(user?.role)}</span>
        </div>
        <button className="topbar-logout-btn" onClick={handleLogout}>
          <span className="material-icons-round">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
