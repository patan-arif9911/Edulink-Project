import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRoleLabel } from "../config/roles";
import "./TopBar.css";

export default function TopBar({ user, onToggleSidebar }) {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    signOut();
    navigate("/", { replace: true });
  };

  const initials = (user?.fullName || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
          <span className="material-icons-round">menu</span>
        </button>
        <h1 className="topbar-greeting">
          Welcome, <span>{user?.fullName || user?.email || "User"}</span>
        </h1>
      </div>

      <div className="topbar-right">
        {/* Notifications bell */}
        <button
          className="topbar-icon-btn topbar-notif-btn"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <span className="material-icons-round">notifications</span>
        </button>

        {/* Profile dropdown */}
        <div className="topbar-profile-wrapper" ref={dropdownRef}>
          <button
            className="topbar-avatar-btn"
            onClick={() => setProfileOpen((p) => !p)}
            aria-label="Profile menu"
          >
            <span className="topbar-avatar">{initials}</span>
            <span className="material-icons-round topbar-caret">
              {profileOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          {profileOpen && (
            <div className="topbar-dropdown">
              <div className="topbar-dropdown-header">
                <span className="topbar-dropdown-avatar">{initials}</span>
                <div>
                  <p className="topbar-dropdown-name">
                    {user?.fullName || user?.email || "User"}
                  </p>
                  <p className="topbar-dropdown-email">{user?.email || ""}</p>
                </div>
              </div>
              <div className="topbar-dropdown-badge">
                <span className="topbar-role-tag">{getRoleLabel(user?.role)}</span>
              </div>
              <div className="topbar-dropdown-divider" />
              <button
                className="topbar-dropdown-item"
                onClick={() => { setProfileOpen(false); navigate("/profile/edit"); }}
              >
                <span className="material-icons-round">person</span>
                Edit Profile
              </button>
              <button
                className="topbar-dropdown-item"
                onClick={() => { setProfileOpen(false); navigate("/change-password"); }}
              >
                <span className="material-icons-round">lock</span>
                Change Password
              </button>
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-item topbar-dropdown-logout" onClick={handleLogout}>
                <span className="material-icons-round">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
