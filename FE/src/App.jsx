import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import AdminLayout from "./layout/admin/AdminLayout";

export default function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/error" replace />;
  }

  return <AdminLayout />;
}