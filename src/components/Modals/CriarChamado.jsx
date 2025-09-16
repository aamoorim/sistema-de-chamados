import { useState, useEffect } from "react";
import { Box, Modal, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function ModalCriarChamado({ isOpen, onClose, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitulo("");
      setDescricao("");
    }
  }, [isOpen]);

  const handleSalvar = () => {
    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha título e descrição");
      return;
    }
    if (typeof onSalvar !== 'function') {
      console.error("onSalvar não é uma função!", onSalvar);
      return;
    }
    onSalvar({ titulo: titulo.trim(), descricao: descricao.trim() });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#fafafa',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    p: 4,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Novo Chamado
        </Typography>

        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>
          TÍTULO
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Digite um título para o chamado"
          slotProps={{ disableUnderline: true }}
          sx={{ mb: 3 }}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>
          DESCRIÇÃO
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="standard"
          placeholder="Descreva o que está acontecendo"
          sx={{ mb: 4 }}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleSalvar}
            sx={{
              bgcolor: "#111",
              px: 6,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              '&:hover': {
                bgcolor: "#000",
              }
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
