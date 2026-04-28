import React, { useContext, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { currentUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`dash-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="dash-overlay" onClick={closeSidebar} />}
      <SideNav role={currentUser?.role} open={sidebarOpen} onClose={closeSidebar} />
      <div className="dash-main">
        <TopBar user={currentUser} onToggleSidebar={toggleSidebar} />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
