import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Avatar,
  IconButton,
  Box,
  Typography,
  InputAdornment,
  styled
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
  DeleteOutlineOutlined as DeleteIcon
} from '@mui/icons-material';
import { useModal } from '../../context/modal-context';
import { useAuth } from '../../context/auth-context';
import ChangePasswordModal from './ChangePasswordModal';

// Styled components
const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    padding: '8px',
    minWidth: '400px',
    maxWidth: '500px',
  }
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiInputBase-root.Mui-disabled': {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  '& .MuiInputBase-input': {
    padding: '10px 0px',
  }
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: '9px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '12px 0',
  fontSize: '16px',
  backgroundColor: '#000',
  '&:hover': {
    backgroundColor: '#111',
  }
}));

const FieldLabel = styled(Typography)(() => ({
  fontSize: '12px',
  fontWeight: 600,
  color: '#535964',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
}));

export default function ProfileModal() {
  const { isProfileModalOpen, closeProfileModal } = useModal();
  const { user } = useAuth();
  const [OpenChangePassword, setOpenChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '' // cuidado: só se a senha estiver disponível no user (não recomendável em prod)
      });
    }
  }, [user]);

  const handleClose = () => {
    closeProfileModal();
  };

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledDialog
      open={isProfileModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 16px',
          fontSize: '18px',
          fontWeight: 500,
          color: '#1E2024'
        }}
      >
        Perfil
        <IconButton onClick={handleClose} sx={{ padding: 0, color: '#6b7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px 24px', overflow: 'visible' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#38bdf8',
                fontSize: '20px',
                fontWeight: 500
              }}
            >
              {getInitials(formData.name)}
            </Avatar>
            <IconButton
              sx={{
                bgcolor: '#F3F4F6',
                width: 36,
                height: 36,
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#e5e7eb'
                }
              }}
            >
              <DeleteIcon sx={{ fontSize: 20, color: '#ef4444' }} />
            </IconButton>
          </Box>

          {/* Nome */}
          <Box>
            <FieldLabel>NOME</FieldLabel>
            <StyledTextField
              fullWidth
              value={formData.name}
              variant="standard"
              disabled
              InputProps={{ disableUnderline: false }}
            />
          </Box>

          {/* E-mail */}
          <Box>
            <FieldLabel>E-MAIL</FieldLabel>
            <StyledTextField
              fullWidth
              value={formData.email}
              variant="standard"
              disabled
              InputProps={{ disableUnderline: false }}
            />
          </Box>

          {/* Senha */}
          <Box>
            <FieldLabel>SENHA</FieldLabel>
            <StyledTextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              variant="standard"
              disabled
              InputProps={{
                disableUnderline: false,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ padding: 0, marginRight: 1 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        fontSize: '14px',
                        textTransform: 'none',
                        color: '#000',
                        padding: '3px 8px',
                        backgroundColor: '#E3E5E8',
                        borderRadius: '5px',
                        '&:hover': { backgroundColor: '#D1D5DB' }
                      }}
                      onClick={handleOpenChangePassword}
                    >
                      Alterar
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Botão de Salvar */}
          <StyledButton
            fullWidth
            variant="contained"
            disabled
            sx={{ mt: 3 }}
          >
            Salvar
          </StyledButton>
        </Box>
      </DialogContent>

      <ChangePasswordModal
        open={OpenChangePassword}
        onClose={handleCloseChangePassword}
      />
    </StyledDialog>
  );
}
