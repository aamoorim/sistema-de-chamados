import React, { useState, useEffect } from "react";
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

export function ModalEditarTecnico({ isOpen, onClose, tecnico }) {
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

  const { updateTecnico } = useTecnicos();

  // Estados locais para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState(""); // senha nova (opcional)

  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome || "");
      setEmail(tecnico.email || "");
      setCargo(tecnico.cargo || "");
      setSenha(""); // nunca preenche senha por segurança
    }
  }, [tecnico]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tecnicoAtualizado = {
      nome,
      email,
      cargo,
      ...(senha.trim() ? { senha } : {}),
    };

    try {
      await updateTecnico(tecnico.id, tecnicoAtualizado);
      onClose(); // fecha o modal após sucesso
    } catch (error) {
      console.error("Erro ao atualizar técnico:", error);
      alert("Erro ao atualizar técnico. Tente novamente.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
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
          />

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
          />

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
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (DEIXE VAZIO CASO NÃO QUEIRA ALTERAR)
          </Typography>
          <TextField
            fullWidth
            type="password"
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 4 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
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
              Salvar Alterações
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
