import React, { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import '../../styles/login/login.scss';
import theme from './LoginTheme';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import OverlayPanel from './OverlayPanel';
import useIsMobile from '../../hooks/useIsMobile';
import { useAuth } from '../../context/auth-context';
import api from '../../services/api';

const LoginForm = () => {
  const { login } = useAuth();
  const isMobile = useIsMobile();

  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    loginEmail: '',
    loginPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (type) => async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (type === 'signup') {
      console.log('Sign Up:', formData);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api-sdc/auth/login", {
        email: formData.loginEmail,
        senha: formData.loginPassword
      });

      if (response.data.token) {
        const userData = {
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token
        };

        // Atualiza o contexto (não faz navigate aqui)
        login(userData);
      } else {
        setError(response.data.erro || "Login inválido");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.response?.data?.erro || "Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (signUpMode) => setIsSignUp(signUpMode);

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-page">
        <Box className="login-container">
          {isMobile ? (
            <Box className={`mobile-form-container ${isSignUp ? 'signup-active' : ''}`}>
              <Box className="mobile-sign-in">
                <SignInForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              </Box>
              <Box className="mobile-sign-up">
                <SignUpForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box className={`sign-up-container ${isSignUp ? 'active' : ''}`}>
                <SignUpForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </Box>
              <Box className={`sign-in-container ${isSignUp ? 'slide' : ''}`}>
                <SignInForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              </Box>
            </>
          )}
          <OverlayPanel isSignUp={isSignUp} toggleMode={toggleMode} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
