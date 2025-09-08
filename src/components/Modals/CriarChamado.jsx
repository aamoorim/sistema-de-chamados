import { Box, Modal, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function ModalCriarChamado({ isOpen, onClose }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#fafafa',            // fundo quase branco
    borderRadius: '12px',          // cantos arredondados
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // sombra suave
    p: 4,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        {/* Botão de fechar no canto */}
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Novo Chamado
        </Typography>

        {/* Campo Título */}
        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ letterSpacing: 1 }}>
          TÍTULO
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Digite um título para o chamado"
          slotProps={{ disableUnderline: true }}
          sx={{ mb: 3 }}
        />

        {/* Campo Descrição */}
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
        />

        {/* Botão salvar */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={onClose}
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
