import React from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';

const SignInForm = ({ formData, handleInputChange, handleSubmit }) => (
  <Box component="form" className="form" onSubmit={handleSubmit('signin')}>
    <img src="/logo_squad.png" alt="Logo da empresa SquadBi" className='form-logo'/>
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

    <Link href="#" className="form-link" onClick={(e) => e.preventDefault()}>
      Esqueceu sua senha?
    </Link>

    <Button type="submit" variant="contained" className="form-button">
      Login
    </Button>
  </Box>
);

export default SignInForm;
