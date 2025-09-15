import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const OverlayPanel = ({ isSignUp, toggleMode }) => (
  <Box className={`overlay-container ${isSignUp ? 'slide' : ''}`}>
    <Box className={`overlay ${isSignUp ? 'slide' : ''}`}>
      {/* Painel esquerdo */}
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

      {/* Painel direito */}
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
);

export default OverlayPanel;
