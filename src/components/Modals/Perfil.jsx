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
import { Close as CloseIcon } from '@mui/icons-material';
import { useModal } from '../../context/modal-context';
import { useAuth } from '../../context/auth-context';

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleClose = () => {
    closeProfileModal();
  };

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0][0].toUpperCase();
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
        <IconButton onClick={handleClose} sx={{ padding: 0, color: '#6b7280ff' }}>
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
          </Box>

          {/* Nome */}
          <Box>
            <FieldLabel>NOME</FieldLabel>
            <StyledTextField
              fullWidth
              value={formData.name}
              variant="standard"
              disabled
              slotProps={{ disableUnderline: false }}
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
              slotProps={{ disableUnderline: false }}
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
    </StyledDialog>
  );
}
