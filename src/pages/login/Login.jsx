import { useAuth } from "../../context/auth-context";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginForm from "../../components/forms/LoginForm";
import authService from "../../services/authService";
import { Snackbar, Alert, AlertTitle} from "@mui/material";


export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");

  // Seta um timer para remover o parâmetro "reason" da URL após alguns segundos
  useEffect(() => {
    if (reason==="expired" || reason === "invalid") {
      const timer = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete ("reason");
        window.history.replaceState({}, document.title, url.toString());
      }, 5000); // Remove o parâmetro após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [reason]);



  // Redireciona se já estiver logado
  if (user) {
    const roleRedirects = {
      admin: "/admin",
      cliente: "/cliente",
      tecnico: "/tecnico",
    };
    return <Navigate to={roleRedirects[user.role] || "/login"} replace />;
  }

  const handleLogin = async ({ email, senha }) => {
    setLoading(true);
    setError("");

    try {
      const userData = await authService.login(email, senha);

      // Padroniza o campo "nome" para "name" antes de salvar
      const normalizedUser = {
        ...userData,
        name: userData.name || userData.nome || "", 
      };

      login(normalizedUser);

      // Redirecionamento conforme role
      if (normalizedUser.role === "admin") navigate("/admin");
      else if (normalizedUser.role === "tecnico") navigate("/tecnico");
      else navigate("/cliente");
    } catch (err) {
      setError("Credenciais inválidas ou erro no servidor");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="login-container">
      {/* Alertas ao redirecionar para login */}
      <Snackbar
        open={reason === "expired" || reason === "invalid"}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {reason === "expired" && (
          <Alert severity="info" variant="filled" sx={{ width: '100%' }}>
            <AlertTitle>Token Expirado</AlertTitle>
            Sua sessão expirou. Por favor, faça login novamente.
          </Alert>
        )}
        {reason === "invalid" && (
          <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            <AlertTitle>Token Inválido</AlertTitle>
            Token inválido. Por favor, faça login novamente.
          </Alert>
        )}
      </Snackbar>

      {/* Formulário de Login */}
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
