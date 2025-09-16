import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTecnicos } from "../../context/TecnicosContext";

export function ModalCriarTecnico({ isOpen, onClose }) {
  const { addTecnico } = useTecnicos();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#fafafa",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    p: 4,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addTecnico({ nome, email, cargo, senha });
      // Limpa o formulário
      setNome("");
      setEmail("");
      setCargo("");
      setSenha("");
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao criar técnico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Dados Pessoais
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontSize={14}
          sx={{ mb: 3 }}
        >
          Defina as informações do perfil do técnico
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography
            variant="caption"
            fontWeight="bold"
            color="text.secondary"
          >
            NOME
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Nome Completo"
            sx={{ mb: 3 }}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          <Typography
            variant="caption"
            fontWeight="bold"
            color="text.secondary"
          >
            E-MAIL
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="standard"
            placeholder="exemplo@email.com"
            sx={{ mb: 3 }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Typography
            variant="caption"
            fontWeight="bold"
            color="text.secondary"
          >
            CARGO
          </Typography>
          <TextField
            fullWidth
            type="text"
            variant="standard"
            placeholder="Cargo do Técnico"
            sx={{ mb: 3 }}
            required
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            disabled={loading}
          />

          <Typography
            variant="caption"
            fontWeight="bold"
            color="text.secondary"
          >
            SENHA
          </Typography>
          <TextField
            fullWidth
            type="password"
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 4 }}
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#111",
                px: 6,
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#000",
                },
              }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
