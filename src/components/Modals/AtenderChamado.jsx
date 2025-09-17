import React, { useState } from "react";
import { Box, Modal, Typography, Button, IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import StatusChip from "../StatusChip";
import chamadosService from "../../services/chamadosService";
import { useAuth } from "../../context/auth-context"; // use o hook customizado

export default function ModalAtenderChamado({ isOpen, onClose, chamado, onChamadoAtualizado }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
    height: 460,
    bgcolor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    p: 3,
  };

  const { user: usuario } = useAuth(); // pega o usuário logado pelo hook
  const [loading, setLoading] = useState(false);

  if (!chamado) return null;

  const handleAtender = async () => {
    setLoading(true);
    try {
      // Backend identifica técnico pelo token (que deve estar no chamadosService)
      await chamadosService.atribuirChamado(chamado.id, {});
      if (onChamadoAtualizado) {
        onChamadoAtualizado();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao atribuir chamado:", error);
      alert("Erro ao atender chamado. Tente novamente.");
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
          aria-label="Fechar modal"
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            border: "1.5px solid #eee",
            borderRadius: "12px",
            p: 2.5,
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight="600">
              #{chamado.id}
            </Typography>
            <StatusChip
              label={chamado.status === "aberto" ? "Aberto" : chamado.status}
              sx={{
                bgcolor: chamado.status === "aberto" ? "#fde7ec" : undefined,
                color: chamado.status === "aberto" ? "#d6336c" : undefined,
                fontWeight: "bold",
                borderRadius: "16px",
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
              }}
            />
          </Box>

          <Typography variant="h6" fontWeight="600" mb={1}>
            {chamado.titulo}
          </Typography>

          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Descrição
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {chamado.descricao}
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Criado em
            </Typography>
            <Typography variant="body2">{chamado.criado}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Cliente
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.8rem",
                  mr: 1.5,
                  bgcolor: "#bbb",
                  color: "#fff",
                }}
              >
                {chamado.cliente
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
              <Typography variant="body2">{chamado.cliente}</Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="contained"
              onClick={handleAtender}
              startIcon={<ContentPasteIcon />}
              sx={{
                bgcolor: "#E9E9E9",
                color: "#2BAF06",
                px: 5,
                py: 1.2,
                borderRadius: "8px",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#d9d9d9",
                },
              }}
              disabled={loading}
            >
              {loading ? "Atribuindo..." : "Atender Chamado"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
