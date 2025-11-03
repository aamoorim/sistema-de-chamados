import {
  Box,
  Modal,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export function DeletarPerfil({ isOpen, onClose, onDelete, usuario }) {
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    minWidth: 300,
    maxWidth: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 2,
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.split(" ");
    return words.map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Perfil
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ alignSelf: "stretch", m: 0 }} />

        {/* Perfil */}
        <Box display="flex" alignItems="center" gap={1} mt={3} mb={2}>
          <Avatar>
            {usuario?.nome ? getInitials(usuario.nome) : "??"}
          </Avatar>
          <Typography variant="body1" fontWeight="500" sx={{ margin: "2px" }}>
            {usuario?.nome || "Usuário não identificado"}
          </Typography>
          <DeleteOutlineOutlinedIcon color="error" fontSize="small" />
        </Box>

        {/* Texto de confirmação */}
        <Typography variant="body2" sx={{ mb: 4 }}>
          Você tem certeza que quer deletar o perfil?
        </Typography>

        <Divider sx={{ alignSelf: "stretch", m: 0 }} />

        {/* Botão de deletar */}
        <Box display="flex" justifyContent="center" padding="20px">
          <Button
            variant="text"
            color="error"
            onClick={onDelete}
            sx={{ margin: "-15px", textTransform: "none" }}
          >
            Deletar Usuário
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
