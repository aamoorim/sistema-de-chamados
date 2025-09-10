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
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

export function ModalSairPerfil({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
   const handleLogout = () => {
    logout();
    navigate('/login')
};

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

  return (
    <Modal open={isOpen} onClose={onClose} >
      <Box sx={style}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Sair do Perfil
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
  <Divider sx={{ alignSelf: 'stretch', m: 0 }} />
        {/* Perfil */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mt={3}
          mb={2}
        >
          <Avatar alt="André Lima" src="/perfil.jpg" />
          <Typography variant="body1" fontWeight="500" sx={{margin: "2px"}} >
            André Lima
          </Typography>
        </Box>

        {/* Texto de confirmação */}
        <Typography variant="body2" sx={{ mb: 4}}>
          Você tem certeza que quer sair?
        </Typography>

  <Divider sx={{ alignSelf: 'stretch', m: 0 }} />

        {/* Botão de sair */}
        <Box display="flex" justifyContent="center" padding="20px">
          <Button
            variant="text"
            color="error"
            onClick={() => handleLogout()}
            sx={{margin: "-15px", textTransform: "none"}}
            
          >
            Sair do Perfil
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
