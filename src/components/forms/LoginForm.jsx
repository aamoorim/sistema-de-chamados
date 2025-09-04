import { useState } from "react";
import '../../styles/login.scss'
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Container,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock} from "@mui/icons-material";

export default function LoginForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Lado esquerdo (oculto no mobile) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          flex: 1,
        }}
      />

      {/* Lado direito (formulário) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#E3E5E8",
          py: { xs: 4, md: 4 },
          borderRadius: "15px 0 0 15px",
          my: 1, 
        }}
      >
        <Container maxWidth="sm">
          <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // centraliza conteúdo verticalmente
                gap: 3,
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 5,
                maxWidth: { xs: "100%", sm: 500, md: 600 },
                minHeight: { xs: "auto", sm: 400, md: 500 },
                mx: "auto",
              }}

          >
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              color="#151619"
            >
              Login
            </Typography>

            <TextField
              variant="standard"
              label="E-MAIL"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              variant="standard"
              label="SENHA"
              name="senha"
              type={showPassword ? "text" : "password"}
              value={formData.senha}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                bgcolor: "#151619",
                "&:hover": { bgcolor: "#1E2024" },
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {error && (
              <Typography
                color="error"
                textAlign="center"
                sx={{ mt: 1, fontSize: "0.9rem" }}
              >
                {error}
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
