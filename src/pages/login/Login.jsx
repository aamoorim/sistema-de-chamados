import { useAuth } from "../../context/auth-context";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import  LoginForm  from "../../components/forms/LoginForm";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se já está logado, redireciona
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
      const res = await axios.post("http://localhost/api-sdc/auth/login", {
        email,
        senha,
      });

      const userData = res.data;
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
    <>
      <div className="login-container">
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </>
  );
}
