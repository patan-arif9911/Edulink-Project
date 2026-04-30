import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/shared/Spinner";

export default function AuthGuard() {
  const { authenticated, initializing } = useContext(AuthContext);
  const location = useLocation();

  if (initializing) return <Spinner fullScreen />;
  if (!authenticated)
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
  return <Outlet />;
}
