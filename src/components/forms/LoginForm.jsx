import React, { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import '../../styles/LoginForm.scss';
import theme from './LoginTheme';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import OverlayPanel from './OverlayPanel';

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
    setFormData({ ...formData, [field]: event.target.value });
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

  const toggleMode = (signUpMode) => setIsSignUp(signUpMode);

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-container">
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
          />
        </Box>

        <OverlayPanel isSignUp={isSignUp} toggleMode={toggleMode} />
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
