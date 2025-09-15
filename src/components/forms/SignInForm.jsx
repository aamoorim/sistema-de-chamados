import React from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const SignInForm = ({ formData, handleInputChange, handleSubmit, loading, error }) => (
  <Box component="form" className="form form-login" onSubmit={handleSubmit('signin')}>
    <img src="/logo_squad.png" alt="Logo da empresa SquadBi" className='form-logo'/>
    
    <Typography variant="h4" component="h1" className="form-title" mt={5}>
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

export default SignInForm;
