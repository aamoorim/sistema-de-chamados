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
import { useAuth } from "../../context/auth-context";

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

  const { setTecnicos } = useTecnicos();
  const { token } = useAuth();

  // Inicializa os estados com os dados do técnico recebido (ou vazio)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState(""); // pode ser senha nova ou vazio

  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome || "");
      setEmail(tecnico.email || "");
      setCargo(tecnico.cargo || "");
      setSenha(""); // não preenche senha para segurança
    }
  }, [tecnico]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tecnicoAtualizado = {
      nome,
      email,
      cargo,
      // Só inclui senha se foi preenchida (atualizar senha)
      ...(senha.trim() ? { senha } : {}),
    };

    try {
      const response = await fetch(
        `https://api-sdc.onrender.com/tecnicos/${tecnico.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tecnicoAtualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar técnico");
      }

      const data = await response.json();

      // Atualiza o contexto para refletir a alteração na tabela
      setTecnicos((prev) =>
        prev.map((t) => (t.id === data.id ? data : t))
      );

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar técnico");
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
          />

          <Typography
            variant="caption"
            fontWeight="bold"
            color="text.secondary"
          >
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
