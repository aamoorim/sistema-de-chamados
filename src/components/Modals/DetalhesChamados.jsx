import { useState, useEffect, useCallback } from "react";
import { Modal, Box, Typography, IconButton, Avatar, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StatusChip from "../StatusChip";
import api from "../../services/api";

export default function ModalChamadoDetalhes({ isOpen, onClose, chamado }) {
  const [cliente, setCliente] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [loadingCliente, setLoadingCliente] = useState(false);
  const [loadingTecnico, setLoadingTecnico] = useState(false);

  const fetchCliente = useCallback(async () => {
    if (!chamado?.cliente_id) {
      setCliente(null);
      return;
    }
    setLoadingCliente(true);
    try {
      const res = await api.get(`/clientes/${chamado.cliente_id}`);
      setCliente(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      setCliente(null);
    } finally {
      setLoadingCliente(false);
    }
  }, [chamado]);

  const fetchTecnico = useCallback(async () => {
    if (!chamado?.tecnico_id) {
      setTecnico(null);
      return;
    }
    setLoadingTecnico(true);
    try {
      const res = await api.get(`/tecnicos/${chamado.tecnico_id}`);
      setTecnico(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (error) {
      console.error("Erro ao buscar técnico:", error);
      setTecnico(null);
    } finally {
      setLoadingTecnico(false);
    }
  }, [chamado]);

  useEffect(() => {
    if (!chamado) return;
    fetchCliente();
    fetchTecnico();
  }, [chamado, fetchCliente, fetchTecnico]);

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

        <Divider sx={{ my: 2 }} />

        {/* Cliente */}
        <Box>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            Cliente
          </Typography>
          {loadingCliente ? (
            <Typography variant="body2" color="text.secondary">
              Carregando cliente...
            </Typography>
          ) : cliente ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#2E3DA3" }}>{getInitials(cliente.nome)}</Avatar>
              <Box>
                <Typography variant="body2">{cliente.nome}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {cliente.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sem cliente atribuído
            </Typography>
          )}
        </Box>

        {/* Técnico */}
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="medium" mb={1}>
            Técnico responsável
          </Typography>
          {loadingTecnico ? (
            <Typography variant="body2" color="text.secondary">
              Carregando técnico...
            </Typography>
          ) : tecnico ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "#2E3DA3" }}>{getInitials(tecnico.nome)}</Avatar>
              <Box>
                <Typography variant="body2">{tecnico.nome}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tecnico.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sem técnico atribuído
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
