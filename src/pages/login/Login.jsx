import { useAuth } from "../../context/auth-context";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginForm from "../../components/forms/LoginForm";
import authService from "../../services/authService";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const queryParams = new URLSearchParams(location.search);
  const initialReason = queryParams.get("reason");
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    if (reason) {
      const timer = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("reason");
        window.history.replaceState({}, "", url.toString());
        setReason(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [reason]);

  if (user) {
    const redirectMap = {
      admin: "/admin",
      cliente: "/cliente",
      tecnico: "/tecnico",
    };
    return <Navigate to={redirectMap[user.role] || "/login"} replace />;
  }

  const handleLogin = async ({ email, senha }) => {
    setLoading(true);
    setError("");
    try {
      const userData = await authService.login(email, senha);
      login({
        ...userData,
        name: userData.name || userData.nome || "",
      });
      navigate(`/${userData.role || "cliente"}`);
    } catch {
      setError("Credenciais inválidas ou erro no servidor");
    } finally {
      setLoading(false);
    }
  };

  const alertConfig = {
    expired: {
      severity: "info",
      title: "Token Expirado",
      message: "Sua sessão expirou. Por favor, faça login novamente.",
      bgColor: "#253ECC", 
    },
    invalid: {
      severity: "error",
      title: "Token Inválido",
      message: "Token inválido. Por favor, faça login novamente.",
      bgColor: "#d32f2fff", 
    },
  };

  const alert = alertConfig[reason];

  return (
    <div className="login-container">
      <Snackbar
        open={!!alert}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {alert && (
          <Alert severity={alert.severity} variant="filled" sx={{ width: "100%", backgroundColor: alert.bgColor,}}>
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
          </Alert>
        )}
      </Snackbar>

      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
