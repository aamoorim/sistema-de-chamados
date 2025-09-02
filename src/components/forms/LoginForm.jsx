import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Login
      </Typography>

      <TextField
        label="E-mail"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Senha"
        name="senha"
        type="password"
        value={formData.senha}
        onChange={handleChange}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
}
