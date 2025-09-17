import { Modal, Box, Typography, IconButton, Avatar, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "../StatusChip";

export default function ModalChamadoDetalhes({ isOpen, onClose, chamado, tecnicos = [] }) {
  if (!chamado) return null;

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
    fontFamily: "Lato",
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const cliente = {
    nome: chamado.cliente_nome || chamado.usuario_nome || null,
    email: chamado.cliente_email || chamado.usuario_email || null,
  };

  let tecnico = {
    nome: chamado.tecnico_nome || null,
    email: chamado.tecnico_email || null,
    id: chamado.tecnico_id || null,
  };

  if ((!tecnico.nome || !tecnico.email) && tecnico.id && tecnicos.length > 0) {
    const tecnicoEncontrado = tecnicos.find((t) => t.id === tecnico.id);
    if (tecnicoEncontrado) {
      tecnico = {
        ...tecnico,
        nome: tecnicoEncontrado.nome,
        email: tecnicoEncontrado.email,
      };
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {chamado.codigo || `#${chamado.id}`}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {chamado.titulo || chamado.tipo}
          </Typography>
          <StatusChip label={chamado.status} />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="medium" mb={0.5}>
            Descrição
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {chamado.descricao || "—"}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="medium" mb={0.5}>
            Criado em
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(chamado.data_criacao || chamado.data).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>

        {chamado.prioridade && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="medium" mb={0.5}>
              Prioridade
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {chamado.prioridade}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            Cliente
          </Typography>
          {cliente.nome ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#2E3DA3" }}>{getInitials(cliente.nome)}</Avatar>
              <Box>
                <Typography variant="body2">{cliente.nome}</Typography>
                {cliente.email && (
                  <Typography variant="caption" color="text.secondary">
                    {cliente.email}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Informações do cliente não disponíveis
            </Typography>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            Técnico responsável
          </Typography>
          {tecnico.nome ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#28a745" }}>{getInitials(tecnico.nome)}</Avatar>
              <Box>
                <Typography variant="body2">{tecnico.nome}</Typography>
                {tecnico.email && (
                  <Typography variant="caption" color="text.secondary">
                    {tecnico.email}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : tecnico.id ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#6c757d" }}>??</Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Técnico ID: {tecnico.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Informações não disponíveis
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum técnico atribuído
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
