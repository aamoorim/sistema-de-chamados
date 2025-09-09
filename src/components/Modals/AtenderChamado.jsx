import { Box, Modal, Typography, Button, IconButton, Avatar, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "../StatusChip"

export default function ModalAtenderChamado({ isOpen, onClose }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 565,
    height: 510,
    bgcolor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    p: 3,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        {/* Botão de fechar */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon sx={{ mt: -1 }}/>
        </IconButton>

        {/* Número do chamado + status */}
        <Box sx={{border: "2px solid #eee", mb: "10px", mt: "10px", padding: "24px", borderRadius: "12px", width: "480px", height: "400px", marginLeft: "20px"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} >
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            00004
          </Typography>
          <StatusChip
            label="Aberto"
            sx={{
              bgcolor: "#fde7ec",
              color: "#d6336c",
              fontWeight: "bold",
              borderRadius: "16px",
              fontSize: "0.8rem",
            }}
          />
        </Box>

        {/* Título */}
        <Typography variant="h6" fontWeight="500" mb={2}>
          Backup não está funcionando
        </Typography>

        {/* Descrição */}
        <Box sx={{  pt: 2, mb: 2 }}>
          <Typography fontSize={13} color="text.secondary">
            Descrição
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ lineHeight: 1.6 }}
          >
            O sistema de backup automático parou de funcionar. Última execução
            bem-sucedida foi há uma semana.
          </Typography>
        </Box>

        {/* Criado em */}
        <Box sx={{  pt: 2, mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Criado em
          </Typography>
          <Typography variant="body2">12/04/25 09:12</Typography>
        </Box>

        {/* Cliente */}
        <Box sx={{ pt: 2, mb: 3 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Cliente
          </Typography>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 28, height: 28, fontSize: "0.8rem", mr: 1.5,  }}>
              AC
            </Avatar>
            <Typography variant="body2">André Costa</Typography>
          </Box>
        </Box>

        </Box>
        {/* Botão de ação */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: "#E9E9E9",
              color: "#2BAF06",
              px: 4,
              py: 1.2,
              borderRadius: "8px",
              fontWeight: "bold",
              "&:hover": {
              },

            }}
          >
            Atender Chamado
          </Button>
        </Box>
        </Box>
    </Modal>
  );
}
