import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignInForm = ({ formData, handleInputChange, handleSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box component="form" className="form form-login" onSubmit={handleSubmit('signin')}>
      <img src="/logo_squad.png" alt="Logo da empresa SquadBi" className='form-logo' />

      <Typography variant="h4" component="h1" className="form-title" mt={5}>
        Login
      </Typography>

      <TextField
        className="form-input"
        label="Email"
        type="email"
        placeholder="email@email.com"
        value={formData.loginEmail}
        onChange={handleInputChange('loginEmail')}
        required
        fullWidth
        variant="standard"
      />

      <TextField
        className="form-input"
        type={showPassword ? 'text' : 'password'}
        label="Senha"
        placeholder="*********"
        value={formData.loginPassword}
        onChange={handleInputChange('loginPassword')}
        required
        fullWidth
        variant="standard"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={togglePasswordVisibility}
                  edge="start"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />

      <Button
        type="submit"
        variant="contained"
        className="form-button"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Login"}
      </Button>

      <Box
        sx={{ minHeight: 56, mt: 2, display: "flex", alignItems: "center" }}
      >
        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SignInForm;
