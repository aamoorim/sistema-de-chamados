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
} from "@mui/material";
import { Trash2, Pencil } from "lucide-react";
import DeletarChamado from "./Modals/DeletarChamado";
import ModalChamadoDetalhes from "./Modals/DetalhesChamados";
import api from "../services/api";
import { useSearch } from "../context/search-context";
import StatusChip from "./StatusChip";
import EditTicketModal from "./Modals/EditarChamado";

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

export default function ListTable() {
  const { search, filters } = useSearch();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedChamadoDetalhes, setSelectedChamadoDetalhes] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // opcional: passar dados para o modal

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
    setSelectedTicket(chamado); // opcional: enviar dados do ticket
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedTicket(null);
    setOpenEditModal(false);
  };

  // Função que aplica a busca e filtros dinamicamente
  const applySearchAndFilters = (data) => {
    const textToSearch = search.toLowerCase().trim();

    return data.filter((item) => {
      // Se há texto na busca, verifica se algum campo contém o termo
      const matchesSearch =
        !textToSearch ||
        item.titulo.toLowerCase().includes(textToSearch) ||
        (item.descricao &&
          item.descricao.toLowerCase().includes(textToSearch)) ||
        (item.cliente_nome &&
          item.cliente_nome.toLowerCase().includes(textToSearch)) ||
        (item.tecnico_nome &&
          item.tecnico_nome.toLowerCase().includes(textToSearch));

      if (!matchesSearch) return false;

      // Aplica filtros dinamicamente - se tiver filtros em um campo, o item deve estar neles
      for (const [filterType, filterValues] of Object.entries(filters)) {
        if (
          filterValues.length > 0 &&
          !filterValues.includes(
            // Mapeia o nome do campo no objeto de acordo com o filtro
            filterType === "status"
              ? item.status
              : filterType === "technician"
              ? item.tecnico_nome
              : filterType === "client"
              ? item.cliente_nome
              : "" // pode ser estendido para outros filtros
          )
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredRows = applySearchAndFilters(rows);

  if (loading)
    return <div style={{ fontFamily: "Lato" }}>Carregando chamados...</div>;
  if (error)
    return <div style={{ color: "red", fontFamily: "Lato" }}>{error}</div>;

  return (
    <div style={{ fontFamily: "Lato" }}>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} chamado
        {filteredRows.length !== 1 ? "s" : ""}
      </div>

      <TableContainer
        component={Paper}
        style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(44,62,80,0.04)" }}
      >
        <Table sx={{ minWidth: 900 }} aria-label="tabela de chamados">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Criado em
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                ID
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Título / Descrição
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Cliente
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Técnico
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
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
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    {new Date(row.data_criacao).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <strong>{row.titulo}</strong>
                    <br />
                    <span style={{ color: "#888", fontSize: 13 }}>
                      {row.descricao}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AvatarInitials name={row.cliente_nome} />
                    {row.cliente_nome || "Sem cliente"}
                  </TableCell>
                  <TableCell>
                    <AvatarInitials name={row.tecnico_nome} />
                    {row.tecnico_nome || "Sem técnico"}
                  </TableCell>
                  <TableCell>
                    <StatusChip label={row.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => handleOpenEdit(row)}>
                      <Pencil size={18} />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
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
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  Nenhum chamado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

      {/* Modal de editar chamado */}
      {openEditModal && (
        <EditTicketModal
          open={openEditModal}
          onClose={handleCloseEdit}
          ticket={selectedTicket} // opcional, caso queira passar os dados do ticket
        />
      )}
    </div>
  );
}
