import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditTicketModal = ({ open = false, onClose, ticket, onSave }) => {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (ticket) {
      setTicketData({
        title: ticket.titulo || '',
        description: ticket.descricao || '',
      });
    }
  }, [ticket]);

  const handleChange = (field) => (event) => {
    setTicketData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(ticketData);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto':
      case 'espera':
        return '#D03E3E';
      case 'em_andamento':
      case 'em-atendimento':
        return '#2196f3';
      case 'encerrado':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'aberto':
      case 'espera':
        return 'Em Espera';
      case 'em_andamento':
      case 'em-atendimento':
        return 'Em Atendimento';
      case 'encerrado':
        return 'Encerrado';
      default:
        return status;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          maxWidth: 480,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          px: 3,
          py: 2,
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Editar Chamado
        </Typography>
        <Chip
          label={getStatusLabel(ticket?.status)}
          sx={{
            backgroundColor: `${getStatusColor(ticket?.status)}20`,
            color: getStatusColor(ticket?.status),
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            alignSelf: 'flex-start',
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{ color: '#555', position: 'absolute', right: 8, top: 8 }}
          aria-label="fechar"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo */}
      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Título */}
          <TextField
            label="Título"
            value={ticketData.title}
            onChange={handleChange('title')}
            fullWidth
            variant="standard"
            size="small"
            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
          />

          {/* Descrição */}
          <TextField
            label="Descrição"
            value={ticketData.description}
            onChange={handleChange('description')}
            fullWidth
            size="small"
            variant="standard"
            multiline
            minRows={3}
            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
          />
        </Box>
      </DialogContent>

      {/* Ações */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            backgroundColor: '#000',
            color: '#fff',
            borderColor: '#000',
            '&:hover': {
              backgroundColor: '#333',
              borderColor: '#333',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            background: '#000',
            '&:hover': {
              backgroundColor: '#333',
              borderColor: '#333',
            },
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModal;
