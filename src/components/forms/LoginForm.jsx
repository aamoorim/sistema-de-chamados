import { useState } from "react";
import { TextField, Button, Box, Typography, ThemeProvider, createTheme } from "@mui/material";

export default function LoginForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const theme = createTheme({
    palette: {
      background: {
        primary: '#FFFFFF',
      },
      grayscale: {
        "gray-100": '#151619',
        "gray-200": '#1E2024',
        "gray-300": '#535964',
        "gray-400": '#858B99',
        "main": '#E3E5E8',
      },
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Lado esquerdo */}
        <Box
          sx={{
            width: "50vw", // Determina que o lado esquerdo tome 50% da tela
          }}
        />
        
        {/* Lado direito */}
        <Box
          sx={{
            width: "50vw",
            display: "flex",
            justifyContent: "center", // centraliza horizontal
            alignItems: "center", // centraliza vertical
            bgcolor: "grayscale.main",
          }}
        >
          {/* Card do login */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "30vw",
              height: "60vh",
              p: 4,
              borderRadius: 5,
              boxShadow: 3,
              bgcolor: "background.primary",
            }}
          >
            <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
              Login
            </Typography>
            
            <TextField
              placeholder="exemplo@mail.com"
              label="E-MAIL"
              variant="standard"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <TextField
              placeholder="********"
              label="SENHA"
              variant="standard"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
              fullWidth
            />
            
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? "Entrando..." : "  Entrar"}
            </Button>
            
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}