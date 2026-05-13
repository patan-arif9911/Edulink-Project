import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PasswordChangeGuard() {
  // No longer force password change, just render children
  return <Outlet />;
}
