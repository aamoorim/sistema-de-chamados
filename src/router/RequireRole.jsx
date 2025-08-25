import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/auth-context";

export default function RequireRole({ allowed }) {
  const { role, user } = useAuth();
  
  // Se não tem usuário logado, redireciona para login
  if (!user || !role) return <Navigate to="/login" replace />;
  
  // Se o role não está na lista de permitidos, redireciona para login
  if (!allowed.includes(role)) return <Navigate to="/login" replace />;
  
  return <Outlet />;
}