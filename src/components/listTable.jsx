import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
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

// Spinner
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
  const isMobile = useIsMobile(1200); // telas menores que 600px

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
    try {
      if (!selectedChamado) return;
      await api.delete(`/chamados/${selectedChamado.id}`);
      await fetchChamados();
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
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
    // Validação simples para evitar campos vazios
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
      handleCloseEdit();
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
      alert("Erro ao atualizar chamado. Verifique os dados e tente novamente.");
    }
  };

  const applySearchAndFilters = (data) => {
    const textToSearch = search.toLowerCase().trim();
    return data.filter((item) => {
      const matchesSearch =
        !textToSearch ||
        item.titulo.toLowerCase().includes(textToSearch) ||
        (item.descricao &&
          item.descricao.toLowerCase().includes(textToSearch)) ||
        (item.cliente_nome &&
          item.cliente_nome.toLowerCase().includes(textToSearch)) ||
        (item.tecnico_nome &&
          item.tecnico_nome.toLowerCase().includes(textToSearch));
        (item.descricao &&
          item.descricao.toLowerCase().includes(textToSearch)) ||
        (item.cliente_nome &&
          item.cliente_nome.toLowerCase().includes(textToSearch)) ||
        (item.tecnico_nome &&
          item.tecnico_nome.toLowerCase().includes(textToSearch));

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
  if (error)
    return <div style={{ color: "red", fontFamily: "Lato" }}>{error}</div>;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "12px 16px",
        boxSizing: "border-box",
        overflowX: "auto",
        fontFamily: "Lato",
      }}
    >
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} chamado
        {filteredRows.length !== 1 ? "s" : ""}
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => (
              <div
                key={row.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  padding: 16,
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  position: "relative",
                  cursor: "pointer",
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
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.cliente_nome || "Sem cliente"}
                  </span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>|</span>
                  <AvatarInitials name={row.tecnico_nome} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.tecnico_nome || "Sem técnico"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: 8, marginTop: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton size="small">
                    <Pencil size={18} />
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
            <div style={{ textAlign: "center", color: "#999", padding: 32 }}>
              Nenhum chamado encontrado
            </div>
          )}
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
            overflowX: "auto",
          }}
        >
          <Table
            aria-label="tabela de chamados"
            size="medium"
            sx={{ minWidth: 650 }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Criado em
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Cliente
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Técnico
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    maxWidth: 150,
                    whiteSpace: "nowrap",
                    wordWrap: "break-word",
                  }}
                >
                  Título / Descrição
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ações
                </TableCell>
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
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      {new Date(row.data_criacao).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        display: "table-cell",
                        verticalAlign: "middle",
                        maxWidth: 180,
                        paddingY: 1,
                        paddingX: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <AvatarInitials name={row.cliente_nome} />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            maxWidth: 120,
                            verticalAlign: "middle",
                          }}
                        >
                          {row.cliente_nome || "Sem cliente"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        display: "table-cell",
                        verticalAlign: "middle",
                        maxWidth: 180,
                        paddingY: 1,
                        paddingX: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <AvatarInitials name={row.tecnico_nome} />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            maxWidth: 120,
                            verticalAlign: "middle",
                          }}
                        >
                          {row.tecnico_nome || "Sem técnico"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 220,
                        minWidth: 120,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle",
                        paddingY: 1,
                        paddingX: 1,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          maxWidth: 210,
                        }}
                      >
                        {row.titulo}
                      </span>
                      <span
                        style={{
                          color: "#888",
                          fontSize: 13,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          maxWidth: 210,
                        }}
                      >
                        {row.descricao}
                      </span>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <StatusChip label={row.status} />
                    </TableCell>
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      <IconButton size="medium">
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="medium"
                        onClick={() => handleOpenDelete(row)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ textAlign: "center", padding: 4, color: "#999" }}
                  >
                    Nenhum chamado encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modais */}
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
