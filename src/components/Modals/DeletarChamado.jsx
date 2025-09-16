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

export default function DeletarChamado({ isOpen, onClose, onDelete, chamado }) {
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
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
            Deletar Chamado
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ alignSelf: "stretch", m: 0 }} />

        {/* Chamado Info */}
        <Box display="flex" alignItems="center" gap={1} mt={3} mb={2}>
          <Avatar>
            {chamado?.titulo ? getInitials(chamado.titulo) : "??"}
          </Avatar>
          <Typography variant="body1" fontWeight="500" sx={{ margin: "2px" }}>
            {chamado?.titulo || "Chamado não identificado"}
          </Typography>
          <DeleteOutlineOutlinedIcon color="error" fontSize="small" />
        </Box>

        {/* Texto de confirmação */}
        <Typography variant="body2" sx={{ mb: 4 }}>
          Você tem certeza que quer deletar este chamado?
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
            Deletar Chamado
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
