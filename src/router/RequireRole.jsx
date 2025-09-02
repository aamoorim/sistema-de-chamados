// RequireRole.jsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/auth-context";

export default function RequireRole({ allowedRoles }) {
  const { role, user } = useAuth();
  
  if (!user || !role) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
