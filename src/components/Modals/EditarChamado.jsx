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
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatusChip from '../StatusChip'; 

const EditTicketModal = ({ open = false, onClose, ticket, onSave }) => {
  const [ticketData, setTicketData] = useState({
    titulo: '',
    descricao: '',
  });

  useEffect(() => {
    if (ticket) {
      setTicketData({
        titulo: ticket.titulo || '',
        descricao: ticket.descricao || '',
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            maxWidth: 480,
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #eee',
          position: 'relative',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Editar Chamado
            </Typography>
            {ticket?.status && (
              <Box mt={1} ml={-2}>
                <StatusChip label={ticket.status} />
              </Box>
            )}
          </Box>

          <IconButton
            onClick={onClose}
            sx={{ color: '#555', position: 'absolute', top: 12, right: 12 }}
            aria-label="Fechar"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Conteúdo */}
      <DialogContent dividers sx={{ px: 3, py: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Título"
            value={ticketData.titulo}
            onChange={handleChange('titulo')}
            fullWidth
            variant="standard"
            size="small"
            sx={{
              backgroundColor: '#fafafa',
              borderRadius: 1,
            }}
          />

          <TextField
            label="Descrição"
            value={ticketData.descricao}
            onChange={handleChange('descricao')}
            fullWidth
            size="small"
            variant="standard"
            multiline
            minRows={4}
            sx={{
              backgroundColor: '#fafafa',
              borderRadius: 1,
            }}
          />
        </Stack>
      </DialogContent>

      {/* Ações */}
      <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #eee' }}>
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
