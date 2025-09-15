import { useAuth } from "../../context/auth-context";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginForm from "../../components/forms/LoginForm";
import authService from "../../services/authService";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const userData = await authService.login(email, senha); // usa o service
      login(userData);

      // Redireciona conforme role
      if (userData.role === "admin") navigate("/admin");
      else if (userData.role === "tecnico") navigate("/tecnico");
      else navigate("/cliente");
    } catch (err) {
      setError("Credenciais inválidas ou erro no servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
