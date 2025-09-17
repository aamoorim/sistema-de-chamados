import React, { useState } from "react";
import { useTecnicos } from "../context/TecnicosContext";
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
import { useSearch } from "../context/search-context";
import { ModalEditarTecnico } from "./Modals/EditarTecnico";

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
  const { search } = useSearch();
  const { tecnicos, deleteTecnico } = useTecnicos();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Estados para modal de edição
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTecnicoEdit, setSelectedTecnicoEdit] = useState(null);

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
      alert("Erro ao deletar técnico: " + error.message);
    }
  };

  // Abrir modal de editar técnico
  const handleOpenEdit = (tecnico) => {
    setSelectedTecnicoEdit(tecnico);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedTecnicoEdit(null);
    setOpenEditModal(false);
  };

  const filteredRows = tecnicos.filter(
    (row) =>
      search === "" ||
      (row.nome && row.nome.toLowerCase().includes(search.toLowerCase())) ||
      (row.cargo && row.cargo.toLowerCase().includes(search.toLowerCase())) ||
      (row.email && row.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {tecnicos.length} técnicos
      </div>

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
                <TableRow key={row.id}>
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
                    <IconButton onClick={() => handleOpenEdit(row)}>
                      <Pencil size={18} />
                    </IconButton>
                    <IconButton
                      color="error"
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
