import { Modal, Box, Typography, IconButton, Chip, Avatar, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Clock2, Check } from "lucide-react";

export default function ModalChamadoDetalhes({ isOpen, onClose, chamado }) {
  if (!chamado) return null; // se não tiver chamado selecionado, não renderiza

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
    outline: "none",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        {/* Botão fechar */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Cabeçalho */}
        <Typography variant="body2" color="text.secondary">
          {chamado.codigo}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
          <Typography variant="h6" fontWeight="bold">
            {chamado.tipo}
          </Typography>
          <Chip
            icon={
              chamado.status === "andamento" ? (
                <Clock2 size={16} />
              ) : (
                <Check size={16} />
              )
            }
            label={chamado.status === "andamento" ? "Em andamento" : "Finalizado"}
            color={chamado.status === "andamento" ? "primary" : "success"}
            variant="outlined"
          />
        </Box>

        {/* Descrição */}
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="medium">
            Descrição
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {chamado.descricao}
          </Typography>
        </Box>

        {/* Data */}
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="medium">
            Criado em
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {chamado.data}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Cliente */}
        <Box>
          <Typography variant="subtitle2" fontWeight="medium">
            Cliente
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Avatar>{chamado.avatar}</Avatar>
            <Box>
              <Typography variant="body2">{chamado.usuario}</Typography>
              <Typography variant="caption" color="text.secondary">
                {chamado.emailCliente || "email@exemplo.com"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Técnico */}
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="medium">
            Técnico responsável
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Avatar>CS</Avatar>
            <Box>
              <Typography variant="body2">Carlos Silva</Typography>
              <Typography variant="caption" color="text.secondary">
                carlos.silva@test.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
