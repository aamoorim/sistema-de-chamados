import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  ThemeProvider,
  createTheme
} from '@mui/material';
import '../../styles/LoginForm.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3DA3',
    },
    secondary: {
      main: '#8996EB',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    loginEmail: '',
    loginPassword: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (type) => (event) => {
    event.preventDefault();
    if (type === 'signup') {
      console.log('Sign Up:', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
    } else {
      console.log('Sign In:', { 
        email: formData.loginEmail, 
        password: formData.loginPassword 
      });
    }
  };

  const toggleMode = (signUpMode) => {
    setIsSignUp(signUpMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-container">
        {/* Container de cadastro */}
        <Box className={`sign-up-container ${isSignUp ? 'active' : ''}`}>
          <Box 
            component="form" 
            className="form" 
            onSubmit={handleSubmit('signup')}
          >
            <Typography variant="h4" component="h1" className="form-title">
              Criar Conta
            </Typography>
            
            <TextField
              className="form-input"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
              fullWidth
              variant="outlined"
            />
            
            <TextField
              className="form-input"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
              variant="outlined"
            />
            
            <TextField
              className="form-input"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              fullWidth
              variant="outlined"
            />
            
            <Button
              type="submit"
              variant="contained"
              className="form-button"
            >
              Criar Conta
            </Button>
          </Box>
        </Box>

        {/* Container de Login */}
        <Box className={`sign-in-container ${isSignUp ? 'slide' : ''}`}>
          <Box 
            component="form" 
            className="form" 
            onSubmit={handleSubmit('signin')}
          >
            <Typography variant="h4" component="h1" className="form-title">
              Login
            </Typography>
            
            <TextField
              className="form-input"
              type="email"
              placeholder="Email"
              value={formData.loginEmail}
              onChange={handleInputChange('loginEmail')}
              required
              fullWidth
              variant="outlined"
            />
            
            <TextField
              className="form-input"
              type="password"
              placeholder="Password"
              value={formData.loginPassword}
              onChange={handleInputChange('loginPassword')}
              required
              fullWidth
              variant="outlined"
            />
            
            <Link 
              href="#" 
              className="form-link"
              onClick={(e) => e.preventDefault()}
            >
              Esqueceu sua senha?
            </Link>
            
            <Button
              type="submit"
              variant="contained"
              className="form-button"
            >
              Login
            </Button>
          </Box>
        </Box>

        {/* Container de sobreposição */}
        <Box className={`overlay-container ${isSignUp ? 'slide' : ''}`}>
          <Box className={`overlay ${isSignUp ? 'slide' : ''}`}>
            {/* Painel de sobreposição esquerdo */}
            <Box className={`overlay-panel overlay-left ${isSignUp ? 'slide' : ''}`}>
              <Typography variant="h4" component="h1" className="overlay-title">
                Bem vindo de volta!
              </Typography>
              <Typography className="overlay-text">
                Para se manter conectado conosco, faça seu login com suas informações pessoais!
              </Typography>
              <Button
                variant="outlined"
                className="form-button ghost-button"
                onClick={() => toggleMode(false)}
              >
                Login
              </Button>
            </Box>

            {/*  Painel de sobreposição direito */}
            <Box className={`overlay-panel overlay-right ${isSignUp ? 'slide' : ''}`}>
              <Typography variant="h4" component="h1" className="overlay-title">
                Olá, tudo bem?
              </Typography>
              <Typography className="overlay-text">
                Se você não possui conta inscreva-se para se conectar conosco e iniciar a sua jornada!
              </Typography>
              <Button
                variant="outlined"
                className="form-button ghost-button"
                onClick={() => toggleMode(true)}
              >
                Criar Conta
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;