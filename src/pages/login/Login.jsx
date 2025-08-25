import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { Navigate } from 'react-router-dom';
import '../../index.css'

export default function Login() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Se já está logado, redireciona baseado no role
  if (user) {
    const roleRedirects = {
      admin: '/admin',
      cliente: '/cliente',
      tecnico: '/tecnico'
    };
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  const handleLogin = async (selectedRole) => {
    setLoading(true);
    
    // Simular dados de usuário baseado no role selecionado
    const userData = {
      id: Date.now().toString(),
      role: selectedRole,
      nome: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Teste`,
      email: `${selectedRole}@email.com`
    };

    // Simular delay de login
    setTimeout(() => {
      login(userData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Logar como:</h2>
        <div className="login-buttons">
          <button 
            onClick={() => handleLogin('cliente')}
            disabled={loading}
            className="login-btn cliente"
          >
            {loading ? 'Carregando...' : 'Cliente'}
          </button>
          <button 
            onClick={() => handleLogin('tecnico')}
            disabled={loading}
            className="login-btn tecnico"
          >
            {loading ? 'Carregando...' : 'Técnico'}
          </button>
          <button 
            onClick={() => handleLogin('admin')}
            disabled={loading}
            className="login-btn admin"
          >
            {loading ? 'Carregando...' : 'Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}