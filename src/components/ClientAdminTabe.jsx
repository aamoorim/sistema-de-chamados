// src/components/ClientAdminTabe.jsx

import { useSearch } from "../context/search-context";
import { useClientes } from "../context/ClientesContext"; 
import { useAuth } from "../context/auth-context"; // para pegar o token
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
import { useState } from "react";

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

export default function ClientTable() {
  const { search } = useSearch();
  const { clientes, setClientes } = useClientes();
  const { token } = useAuth();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedRow(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedRow) {
      return;
    }
    try {
      const res = await fetch(
        `https://api-sdc.onrender.com/clientes/${selectedRow.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Erro ao deletar cliente: status ${res.status}`);
      }

      // Remove do contexto / estado local
      setClientes((prev) => prev.filter((c) => c.id !== selectedRow.id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Não foi possível deletar cliente. Verifique permissão ou token.");
    } finally {
      handleCloseDelete();
    }
  };

  const filteredRows = clientes.filter((row) => {
    if (!row) return false;
    const term = search.toLowerCase();
    return (
      search === "" ||
      (row.nome && row.nome.toLowerCase().includes(term)) ||
      (row.empresa && row.empresa.toLowerCase().includes(term)) ||
      (row.setor && row.setor.toLowerCase().includes(term)) ||
      (row.email && row.email.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {clientes.length} clientes
      </div>

      <TableContainer
        component={Paper}
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
          marginBottom: 32,
        }}
      >
        <Table sx={{ minWidth: 900 }} aria-label="tabela de clientes">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Nome
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Empresa
              </TableCell>
              <TableCell style={{ color: "#858B99", fontWeight: 600 }}>
                Setor
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
              filteredRows.map((row) => {
                const initials = row.nome
                  ? row.nome
                      .split(" ")
                      .map((n) => (n && n.length > 0 ? n[0] : ""))
                      .join("")
                      .slice(0, 2)
                  : "??";

                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Avatar initials={initials} />
                      {row.nome || "-"}
                    </TableCell>
                    <TableCell>{row.empresa || "-"}</TableCell>
                    <TableCell>{row.setor || "-"}</TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    <TableCell>
                      <IconButton>
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
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{ textAlign: "center", padding: "40px", color: "#999" }}
                >
                  Nenhum cliente encontrado com os filtros aplicados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDeleteConfirmed}
        usuario={selectedRow}
      />
    </div>
  );
}
