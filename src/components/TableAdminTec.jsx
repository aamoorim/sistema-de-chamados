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

export default function TechnicianTable() {
  const isMobile = useIsMobile(1200);
  const { search } = useSearch();
  const { tecnicos, deleteTecnico } = useTecnicos();

  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTecnicoEdit, setSelectedTecnicoEdit] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [tecnicos]);

  const handleOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedRow(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedRow) return;
    try {
      await deleteTecnico(selectedRow.id);
    } catch (error) {
      console.error("Erro ao deletar técnico:", error);
      alert("Não foi possível deletar técnico.");
    } finally {
      handleCloseDelete();
    }
  };

  const handleOpenEdit = (tecnico) => {
    setSelectedTecnicoEdit(tecnico);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedTecnicoEdit(null);
    setOpenEditModal(false);
  };

  const filteredRows = tecnicos.filter((row) => {
    if (!row) return false;
    const term = search.toLowerCase();
    return (
      search === "" ||
      (row.nome && row.nome.toLowerCase().includes(term)) ||
      (row.cargo && row.cargo.toLowerCase().includes(term)) ||
      (row.email && row.email.toLowerCase().includes(term))
    );
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ fontFamily: "Lato" }}>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {tecnicos.length} técnicos
      </div>

      {isMobile ? (
        <div className="client-table-mobile">
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => (
              <div key={row.id} className="client-card">
                <div><b>Nome:</b> {row.nome}</div>
                <div><b>Cargo:</b> {row.cargo}</div>
                <div><b>Email:</b> {row.email}</div>
                <div className="actions">
                  <IconButton onClick={() => handleOpenEdit(row)}>
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(row)}>
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              </div>
            ))
          ) : (
            <div className="client-card-empty">
              Nenhum técnico encontrado com os filtros aplicados
            </div>
          )}
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
            marginBottom: 4,
            overflowX: "auto",
            "@media (max-width: 768px)": {
              "& table": { minWidth: "700px" },
            },
          }}
        >
          <Table aria-label="tabela de técnicos">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Cargo</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>E-mail</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Avatar initials={initials} />
                        {row.nome || "-"}
                      </TableCell>
                      <TableCell>{row.cargo || "-"}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenEdit(row)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDelete(row)}>
                          <Trash2 size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ textAlign: "center", padding: "40px", color: "#999" }}
                  >
                    Nenhum técnico encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDeleteConfirmed}
        usuario={selectedRow}
      />

      <ModalEditarTecnico
        isOpen={openEditModal}
        onClose={handleCloseEdit}
        tecnico={selectedTecnicoEdit}
      />
    </div>
  );
}
