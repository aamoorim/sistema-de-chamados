import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const SignUpForm = ({ formData, handleInputChange, handleSubmit }) => (
  <Box component="form" className="form" onSubmit={handleSubmit('signup')}>
    <img src="/logo_squad.png" alt="Logo da empresa SquadBi" className='form-logo'/>
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

    <Button type="submit" variant="contained" className="form-button">
      Criar Conta
    </Button>
  </Box>
);

export default SignUpForm;
