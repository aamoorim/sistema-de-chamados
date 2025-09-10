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
import { Visibility, VisibilityOff, Lock, AccountCircleOutlined} from "@mui/icons-material";

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
        
        {/* Container de login */}
        <Container maxWidth="sm">
          <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", 
                gap: 3,
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 5,
                maxWidth: { xs: "100%", sm: 500, md: 600 },
                minHeight: { xs: "auto", sm: 400, md: 500 },
                mx: "auto",
              }}
          >

           {/* Logo */}
           <Box
               sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                }}
            >
              <img
                src="/logo_squad.png"
                alt="Logo Squad"
                style={{
                 height: "auto", 
                 width: "auto",
                 maxWidth: "200px",
                }}
              />
            </Box>

            {/* Título do formulário */}
            <Typography
              variant="h5"
              textAlign="start"
              fontWeight="bold"
              color="#151619"
            >
              Login
            </Typography>

            {/* Inputs para login */}
            <TextField
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 700,
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                },
                '& .MuiInputBase-input': {
                  fontWeight: 500, 
                }
              }}
              variant="standard"
              label="E-MAIL"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleOutlined sx={{color: '#535964'}}/> 
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 700,
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset !important',
                },
                '& .MuiInputBase-input': {
                  fontWeight: 600, 
                }
              }}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{color: '#535964'}}/> 
                    </InputAdornment>
                  ),
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

            {/* Botão de entrar */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                my: 2,
                fontSize: "1.15rem",
                fontWeight: 700,
                bgcolor: "#151619",
                "&:hover": { bgcolor: "#1E2024" },
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {/* Mensagem de erro caso o login falhe */}
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
