import React, { useState } from 'react';
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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Divider from '@mui/material/Divider';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { useModal } from '../../context/modal-context'; // Importar o hook
import ChangePasswordModal from './ChangePasswordModal';  

// Styled components para customização
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    padding: '8px',
    minWidth: '400px',
    maxWidth: '500px',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '10px 0px',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '9px',
  textTransform: 'none',
  fontWeight: "bold",
  padding: '12px 0',
  fontSize: '16px',
  backgroundColor: '#000',
  '&:hover': {
    backgroundColor: '#111',
  }
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 600,
  color: '#535964',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
}));

export default function ProfileModal() {
  const { isProfileModalOpen, closeProfileModal } = useModal(); // Usar o estado global
  const [OpenChangePassword, setOpenChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Carlos Silva',
    email: 'carlos.silva@test.com',
    password: ''
  });

  const handleClose = () => {
    closeProfileModal();
  };

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  }

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  }

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    console.log('Dados salvos:', formData);
    // Aqui você adicionaria a lógica para salvar os dados
    handleClose();
  };

  return (
    <StyledDialog
      open={isProfileModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 24px 16px',
        fontSize: '18px',
        fontWeight: 500,
        color: '#1E2024'
      }}>
        Perfil
        <IconButton onClick={handleClose} sx={{ padding: 0, color: '#6b7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px 24px', overflow: 'visible' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* Avatar Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 , mb: 2 }}>
            <Avatar
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: '#38bdf8',
                fontSize: '20px',
                fontWeight: 500
              }}
            >
              CS
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
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: '#ef4444' }} />
            </IconButton>
          </Box>

          {/* Name Field */}
          <Box>
            <FieldLabel>NOME</FieldLabel>
            <StyledTextField
              fullWidth
              sx={{ mb: 0}}
              value={formData.name}
              onChange={handleInputChange('name')}
              variant="standard"
              InputProps=
              {{ disableUnderline: false ,
                 readOnly: true
              }} 
            />
          </Box>

          {/* Email Field */}
          <Box>
            <FieldLabel sx={{}}>E-MAIL</FieldLabel>
            <StyledTextField
              fullWidth
              sx={{ mb: -1 }}
              value={formData.email}
              onChange={handleInputChange('email')}
              variant="standard"
              InputProps={{ 
                disableUnderline: false,
                readOnly: true
               }}
            />
          </Box>

          {/* Password Field */}
          <Box>
            <FieldLabel sx={{mb:0}}>SENHA</FieldLabel>
            <StyledTextField
              fullWidth
              sx={{ mb: 0}}
              type={showPassword ? 'text' : 'password'}
              value={formData.password || ''}
              onChange={handleInputChange('password')}
              variant="standard"
              InputProps={{
                disableUnderline: false,
                endAdornment: (
                  <InputAdornment position="end">
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
                ),
              }}
            />
          </Box>

          {/* Save Button */}
          <StyledButton
            fullWidth
            variant="contained"
            onClick={handleSave}
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
