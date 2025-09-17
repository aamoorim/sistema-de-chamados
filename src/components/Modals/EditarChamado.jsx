import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Chip,
  Grid,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditTicketModal = ({ open = true, onClose, ticket }) => {
  const [ticketData, setTicketData] = useState({
    title: 'Problema na impressora do setor financeiro',
    description: 'A impressora HP LaserJet do setor financeiro está apresentando falhas na impressão. As páginas saem borradas e com manchas pretas.',
    creationDate: '2024-01-15',
    clientName: 'João Silva',
    technicianName: 'Maria Santos',
    status: 'em-atendimento'
  });

  const handleChange = (field) => (event) => {
    setTicketData({ ...ticketData, [field]: event.target.value });
  };

  const handleSave = () => {
    console.log('Dados salvos:', ticketData);
    onClose?.();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'espera': return '#D03E3E';
      case 'em-atendimento': return '#2196f3';
      case 'encerrado': return '#4caf50';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'espera': return 'Em Espera';
      case 'em-atendimento': return 'Em Atendimento';
      case 'encerrado': return 'Encerrado';
      default: return status;
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
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
        }
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
          py: 2
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Editar Chamado
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#555' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Status Chip */}
      <Box sx={{ px: 3, py: 2 }}>
        <Chip
          label={getStatusLabel(ticketData.status)}
          sx={{
            backgroundColor: `${getStatusColor(ticketData.status)}20`,
            color: getStatusColor(ticketData.status),
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 2,
            px: 2,
            py: 0.5
          }}
        />
      </Box>

      {/* Conteúdo */}
      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Título */}
          <TextField
            label="Título"
            value={ticketData.title}
            onChange={handleChange('title')}
            fullWidth
            variant='standard'
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
            variant='standard'
            multiline
            minRows={3}
            sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
          />

          {/* Data e Status */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Data de Criação"
                type="date"
                value={ticketData.creationDate}
                onChange={handleChange('creationDate')}
                fullWidth
                variant='standard'
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                value={ticketData.status}
                onChange={handleChange('status')}
                fullWidth
                variant='standard'
                size="small"
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 ,mt:2}}
              >
                <MenuItem value="espera">Em Espera</MenuItem>
                <MenuItem value="em-atendimento">Em Atendimento</MenuItem>
                <MenuItem value="encerrado">Encerrado</MenuItem>
              </Select>
            </Grid>
          </Grid>

          {/* Cliente e Técnico */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Cliente"
                value={ticketData.clientName}
                onChange={handleChange('clientName')}
                fullWidth
                variant='standard'
                size="small"
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Técnico"
                value={ticketData.technicianName}
                onChange={handleChange('technicianName')}
                variant='standard'
                fullWidth
                size="small"
                sx={{ backgroundColor: '#fafafa', borderRadius: 1 }}
              />
            </Grid>
          </Grid>
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
