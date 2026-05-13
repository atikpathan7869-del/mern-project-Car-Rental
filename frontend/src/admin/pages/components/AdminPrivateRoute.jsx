import { Navigate, Outlet } from "react-router-dom";

export default function AdminPrivateRoute() {
  const adminData = localStorage.getItem("adminData");

  if (!adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
