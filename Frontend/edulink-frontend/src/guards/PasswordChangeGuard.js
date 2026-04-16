import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PasswordChangeGuard() {
  const { mustChangePassword } = useContext(AuthContext);

  if (mustChangePassword) return <Navigate to="/change-password" replace />;
  return <Outlet />;
}
