import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/shared/Spinner";

export default function RoleGuard({ permitted }) {
  const { currentUser, authenticated, initializing } = useContext(AuthContext);

  if (initializing) return <Spinner fullScreen />;
  if (!authenticated) return <Navigate to="/login" replace />;
  if (!permitted.includes(currentUser?.role))
    return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
