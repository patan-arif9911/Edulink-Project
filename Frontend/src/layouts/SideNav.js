import React from "react";
import { NavLink } from "react-router-dom";
import { getMenuForRole } from "../config/sidebarMenus";
import { getRoleLabel } from "../config/roles";
import "./SideNav.css";

export default function SideNav({ role, open, onClose }) {
  const menuItems = getMenuForRole(role);

  return (
    <aside className={`sidenav ${open ? "sidenav-open" : ""}`}>
      <div className="sidenav-brand">
        <span className="material-icons-round sidenav-logo">school</span>
        <span className="sidenav-title">EduLink</span>
        <button className="sidenav-close-btn" onClick={onClose} aria-label="Close menu">
          <span className="material-icons-round">close</span>
        </button>
      </div>

      <div className="sidenav-role-tag">{getRoleLabel(role)}</div>

      <nav className="sidenav-links">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidenav-item ${isActive ? "sidenav-active" : ""}`
            }
            onClick={onClose}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span className="sidenav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
