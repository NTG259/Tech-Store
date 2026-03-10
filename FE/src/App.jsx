import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import AdminLayout from "./layout/admin/AdminLayout";

export default function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Chưa đăng nhập thì đưa về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Đã đăng nhập nhưng không phải ADMIN thì chặn vào dashboard và đưa ra trang error
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/error" replace />;
  }

  // ADMIN hợp lệ thì vào layout dashboard bình thường
  return <AdminLayout />;
}