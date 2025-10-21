import React, { useState, useEffect, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Trash2, Pencil } from "lucide-react";
import DeletarChamado from "./Modals/DeletarChamado";
import ModalChamadoDetalhes from "./Modals/DetalhesChamados";
import EditTicketModal from "./Modals/EditarChamado";
import api from "../services/api";
import chamadosService from "../services/chamadosService";
import { useSearch } from "../context/search-context";
import StatusChip from "./StatusChip";
import { useTheme } from "@emotion/react";
import useIsMobile from "../hooks/useIsMobile";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Avatar com iniciais
function AvatarInitials({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "#2E3DA3",
        color: "#fff",
        fontWeight: 600,
        fontSize: 14,
        marginRight: 8,
        fontFamily: "Lato",
      }}
    >
      {initials}
    </span>
  );
}

// Spinner de carregamento
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #604FEB",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

export default function ListTable() {
  const theme = useTheme();
  const isMobile = useIsMobile(1115);


  const cardStyle = isMobile
    ? {
        width: "100%",   // ocupa quase toda a largura em mobile
        maxWidth: "80vw",
        minWidth: "60vw",
        
      }
    : {
        width: "100%",  // largura responsiva que diminui conforme a tela diminui
        maxWidth: "30vw",
        minWidth: "10vw",
      };

  const { search, filters } = useSearch();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedChamadoDetalhes, setSelectedChamadoDetalhes] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedChamadoEdit, setSelectedChamadoEdit] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const showToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const fetchChamados = async () => {
    try {
      setLoading(true);
      const response = await api.get("/chamados");
      setRows(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
      setError("Erro ao carregar chamados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
    const interval = setInterval(async () => {
      try {
        const response = await api.get("/chamados");
        setRows(response.data);
      } catch (err) {
        console.error("Erro ao atualizar chamados:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenDelete = (chamado) => {
    setSelectedChamado(chamado);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedChamado(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedChamado) return;
    if (["em_andamento"].includes(selectedChamado.status)) {
      showToast("Não é permitido deletar chamados em andamento.", "error");
      handleCloseDelete();
      return;
    }

    try {
      await api.delete(`/chamados/${selectedChamado.id}`);
      await fetchChamados();
      showToast(`Chamado #${selectedChamado.id} deletado com sucesso`, "success");
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
      showToast("Erro ao deletar chamado", "error");
    }
    handleCloseDelete();
  };

  const handleRowClick = (row) => {
    setSelectedChamadoDetalhes(row);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedChamadoDetalhes(null);
    setOpenDetailsModal(false);
  };

  const handleOpenEdit = (chamado) => {
    setSelectedChamadoEdit(chamado);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedChamadoEdit(null);
    setOpenEditModal(false);
  };

  const handleEditSave = async (dadosEditados) => {
    if (!dadosEditados.titulo?.trim() || !dadosEditados.descricao?.trim()) {
      alert("Por favor, informe título e descrição.");
      return;
    }

    try {
      await chamadosService.atualizarChamado(selectedChamadoEdit.id, {
        titulo: dadosEditados.titulo,
        descricao: dadosEditados.descricao,
      });
      await fetchChamados();
      showToast(`Chamado #${selectedChamadoEdit.id} editado com sucesso`, "success");
      handleCloseEdit();
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
      showToast("Erro ao atualizar chamado", "error");
    }
  };

  const applySearchAndFilters = (data) => {
    const textToSearch = search.toLowerCase().trim();
    return data.filter((item) => {
      const matchesSearch =
        !textToSearch ||
        item.titulo.toLowerCase().includes(textToSearch) ||
        (item.descricao && item.descricao.toLowerCase().includes(textToSearch)) ||
        (item.cliente_nome && item.cliente_nome.toLowerCase().includes(textToSearch)) ||
        (item.tecnico_nome && item.tecnico_nome.toLowerCase().includes(textToSearch));

      if (!matchesSearch) return false;

      for (const [filterType, filterValues] of Object.entries(filters)) {
        if (
          filterValues.length > 0 &&
          !filterValues.includes(
            filterType === "status"
              ? item.status
              : filterType === "technician"
              ? item.tecnico_nome
              : filterType === "client"
              ? item.cliente_nome
              : ""
          )
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredRows = applySearchAndFilters(rows);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: "red", fontFamily: "Lato" }}>{error}</div>;

  return (
  <div
    style={{
      width: isMobile ? "100%" : "calc(95vw - 230px)",
      marginLeft: isMobile ? 0 : "230px",
      padding: "12px 16px",
      boxSizing: "border-box",
      overflowX: "auto",
      fontFamily: "Lato",
      transition: "margin-left 0.3s ease",
      maxWidth: "1600px",
      paddingTop: 60, // para considerar navbar fixa
    }}
  >
    <Snackbar
      open={toastOpen}
      autoHideDuration={2000}
      onClose={handleToastClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleToastClose}
        severity={toastSeverity}
        sx={{ bgcolor: "#604FEB", color: "#fff" }}
      >
        {toastMessage}
      </Alert>
    </Snackbar>

    <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
      Mostrando {filteredRows.length} chamado
      {filteredRows.length !== 1 ? "s" : ""}
    </div>

    {isMobile ? (
      <div
        className="calls-admin-table-mobile"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingLeft: 230, // sidebar fixa
          alignItems: "center", // centraliza cards horizontalmente
          minHeight: "calc(100vh - 60px)", // altura total menos navbar
        }}
      >
        {filteredRows.length > 0 ? (
          filteredRows.map((row) => (
            <div
              key={row.id}
              className="calls-admin-card"
              style={{
                marginBottom: 8,
                position: "relative",
                cursor: "pointer",
                ...cardStyle,
              }}
              onClick={() => handleRowClick(row)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#858B99", fontSize: 13 }}>
                  {new Date(row.data_criacao).toLocaleDateString("pt-BR")}
                </span>
                <StatusChip label={row.status} />
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.titulo}
              </div>
              <div
                style={{
                  color: "#888",
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.descricao}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <AvatarInitials name={row.cliente_nome} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {row.cliente_nome || "Sem cliente"}
                </span>
                <span style={{ color: "#aaa", fontSize: 12 }}>|</span>
                <AvatarInitials name={row.tecnico_nome} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {row.tecnico_nome || "Sem técnico"}
                </span>
              </div>
              <div
                style={{ display: "flex", gap: 8, marginTop: 8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton size="small">
                  <Pencil size={18} onClick={() => handleOpenEdit(row)} />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenDelete(row)}
                >
                  <Trash2 size={18} />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#999",
              padding: 32,
            }}
          >
            Nenhum chamado encontrado
          </div>
        )}
      </div>
    ) : (
      <TableContainer
        component={Paper}
        className="calls-admin-table-desktop"
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
          width: "100%",
          minWidth: "800px",
          overflowX: "auto",
        }}
      >
        <Table
          aria-label="tabela de chamados"
          size="small"
          sx={{ width: "100%", tableLayout: "auto" }}
        >
          <TableHead>
            <TableRow>
              {[
                "Criado em",
                "ID",
                "Cliente",
                "Técnico",
                "Título / Descrição",
                "Status",
                "Ações",
              ].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    padding: { xs: "6px 8px", md: "12px 16px" },
                    fontSize: { xs: "0.75rem", md: "0.9rem" },
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                    }}
                  >
                    {new Date(row.data_criacao).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: "normal",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                    }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <AvatarInitials name={row.cliente_nome} />
                      <span>{row.cliente_nome || "Sem cliente"}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <AvatarInitials name={row.tecnico_nome} />
                      <span>{row.tecnico_nome || "Sem técnico"}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{row.titulo}</span>
                    <br />
                    <span style={{ color: "#888", fontSize: "0.75rem" }}>
                      {row.descricao}
                    </span>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: "6px 8px", md: "12px 16px" } }}>
                    <StatusChip label={row.status} />
                  </TableCell>
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      whiteSpace: "nowrap",
                      padding: { xs: "6px 8px", md: "12px 16px" },
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
                      onClick={() => handleOpenEdit(row)}
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
                      onClick={() => handleOpenDelete(row)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ textAlign: "center", padding: "1rem", color: "#999" }}
                >
                  Nenhum chamado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )}

    <DeletarChamado
      isOpen={openDeleteModal}
      onClose={handleCloseDelete}
      onDelete={handleDeleteConfirmed}
      chamado={selectedChamado}
    />

    <ModalChamadoDetalhes
      isOpen={openDetailsModal}
      onClose={handleCloseDetails}
      chamado={selectedChamadoDetalhes}
    />

    <EditTicketModal
      open={openEditModal}
      onClose={handleCloseEdit}
      ticket={selectedChamadoEdit}
      onSave={handleEditSave}
    />
  </div>
);



}
