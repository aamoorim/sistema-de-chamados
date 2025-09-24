import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTecnicos } from "../../context/TecnicosContext";

export function ModalEditarTecnico({ isOpen, onClose, tecnico }) {
  const { updateTecnico } = useTecnicos();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🚨 mesma lógica do ModalCriarTecnico
  const senhasNaoConferem =
    senha && confirmarSenha && senha !== confirmarSenha;

  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome || "");
      setEmail(tecnico.email || "");
      setCargo(tecnico.cargo || "");
      setSenha("");
      setConfirmarSenha("");
      setError(null);
    }
  }, [tecnico]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const tecnicoAtualizado = {
      nome,
      email,
      cargo,
      ...(senha.trim() ? { senha } : {}),
    };

    try {
      await updateTecnico(tecnico.id, tecnicoAtualizado);
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao atualizar técnico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "#fafafa",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" mb={1}>
          Editar Técnico
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontSize={14}
          mb={3}
        >
          Atualize as informações do técnico
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
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

          {/* Email */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
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

          {/* Cargo */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
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

          {/* Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (DEIXE VAZIO CASO NÃO QUEIRA ALTERAR)
          </Typography>
          <TextField
            fullWidth
            type={mostrarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 3 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    disabled={loading}
                  >
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirmar Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            CONFIRMAR SENHA
          </Typography>
          <TextField
            fullWidth
            type={mostrarConfirmar ? "text" : "password"}
            variant="standard"
            placeholder="Confirme a Senha"
            sx={{ mb: 4 }}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={loading}
            error={senhasNaoConferem}
            helperText={senhasNaoConferem ? "As senhas não coincidem" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    disabled={loading}
                  >
                    {mostrarConfirmar ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
              disabled={loading || senhasNaoConferem}
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
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
