import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="dash-shell">
      <SideNav role={currentUser?.role} />
      <div className="dash-main">
        <TopBar user={currentUser} />
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
