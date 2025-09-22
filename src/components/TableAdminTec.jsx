import React, { useState, useEffect } from "react";
import { useTecnicos } from "../context/TecnicosContext";
import { useSearch } from "../context/search-context";
import useIsMobile from "../hooks/useIsMobile";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { DeletarPerfil } from "./Modals/DeletarPerfil";
import { ModalEditarTecnico } from "./Modals/EditarTecnico";  
import "../styles/tables/listTable.scss";

// Spinner component
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

// Avatar com iniciais
function Avatar({ initials }) {
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
      }}
    >
      {initials}
    </span>
  );
}

export default function TechnicianTable() {
  const isMobile = useIsMobile(900);
  const { search } = useSearch();
  const { tecnicos, deleteTecnico } = useTecnicos();

  const [loading, setLoading] = useState(true);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTecnicoEdit, setSelectedTecnicoEdit] = useState(null);

  // Quando tecnicos muda, parar o loading
  useEffect(() => {
    if (tecnicos && Array.isArray(tecnicos)) {
      // você pode ajustar esse timeout ou removê-lo
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tecnicos]);

  const handleOpenEdit = (tecnico) => {
    setSelectedTecnicoEdit(tecnico);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedTecnicoEdit(null);
    setOpenEditModal(false);
  };

  const handleOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedRow(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirmed = async (id) => {
  if (!id) {
    alert("Usuário não identificado.");
    return;
  }

  try {
    await deleteTecnico(id);
    handleCloseDelete();
  } catch (error) {
    console.error("Erro ao deletar técnico:", error);

    const apiMessage =
      error.response?.data?.erro || // API personalizada
      error.response?.data?.message || // fallback padrão
      error.message;

    alert(`Erro ao deletar técnico: ${apiMessage}`);
  }
};


  const filteredRows = tecnicos.filter((row) => {
    const term = search.toLowerCase();
    return (
      search === "" ||
      (row.nome && row.nome.toLowerCase().includes(term)) ||
      (row.cargo && row.cargo.toLowerCase().includes(term)) ||
      (row.email && row.email.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ fontFamily: "Lato" }}>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {tecnicos.length} técnicos
      </div>

      {/* TABELA DESKTOP */}
      <div className="client-table-desktop">
        <TableContainer
          component={Paper}
          style={{
            borderRadius: 14,
            boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
            marginBottom: 32,
          }}
        >
          <Table sx={{ minWidth: 900 }} aria-label="tabela de técnicos">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                  Nome
                </TableCell>
                <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                  Cargo
                </TableCell>
                <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                  E-mail
                </TableCell>
                <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Avatar
                        initials={
                          row.nome
                            ? row.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                            : "??"
                        }
                      />
                      {row.nome || "-"}
                    </TableCell>
                    <TableCell>{row.cargo || "-"}</TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(row);
                        }}
                      >
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDelete(row);
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#999",
                    }}
                  >
                    Nenhum técnico encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* MOBILE CARDS */}
      <div className="client-table-mobile">
        {filteredRows.length > 0 ? (
          filteredRows.map((row) => {
            const initials = row.nome
              ? row.nome
                  .split(" ")
                  .map((n) => (n && n.length > 0 ? n[0] : ""))
                  .join("")
                  .slice(0, 2)
              : "??";
            return (
              <div className="client-card" key={row.id}>
                <div className="client-card-header">
                  <Avatar initials={initials} />
                  <div className="client-card-title">{row.nome || "-"}</div>
                </div>
                <div className="client-card-info">
                  <div>
                    <b>Cargo:</b> {row.cargo || "-"}
                  </div>
                  <div>
                    <b>E-mail:</b> {row.email || "-"}
                  </div>
                </div>
                <div className="client-card-actions">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(row);
                    }}
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDelete(row);
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              </div>
            );
          })
        ) : (
          <div className="client-card-empty">
            Nenhum técnico encontrado com os filtros aplicados
          </div>
        )}
      </div>

      {/* Modal de deleção */}
      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={() => handleDeleteConfirmed(selectedRow?.id)}
        usuario={selectedRow}
      />

      {/* Modal de edição */}
      <ModalEditarTecnico
        isOpen={openEditModal}
        onClose={handleCloseEdit}
        tecnico={selectedTecnicoEdit}
      />
    </div>
  );
}
