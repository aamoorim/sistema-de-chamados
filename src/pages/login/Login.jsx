import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../index.css';

export default function Login() {
  const { user, login } = useAuth(); // ✅ Correto: user vem do useAuth
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se já está logado, redireciona
  if (user) {
    const roleRedirects = {
      admin: '/admin',
      cliente: '/cliente',
      tecnico: '/tecnico'
    };
    
    console.log('Login - User found, redirecting to:', roleRedirects[user.role]);
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chamada para seu backend (ajuste a URL!)
      const res = await axios.post("http://localhost/api-sdc/auth/login", {
        email,
        senha
      });

      const userData = res.data;
      console.log('Login - Response data:', userData);
      
      login(userData);

      // Redireciona conforme o role
      if (userData.role === "admin") navigate("/admin");
      else if (userData.role === "tecnico") navigate("/tecnico");
      else navigate("/cliente");
      
    } catch (err) {
      console.error('Login - Error:', err);
      setError("Credenciais inválidas ou erro no servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}