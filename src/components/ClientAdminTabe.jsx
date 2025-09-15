import { useSearch } from "../context/search-context";
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

const rows = [
  {
    id: "C001",
    nome: "André Costa",
    empresa: "Tech Solutions",
    setor: "TI",
    email: "andre.costa@tech.com",
  },
  {
    id: "C002",
    nome: "Maria Lima",
    empresa: "Inova Ltda",
    setor: "Financeiro",
    email: "maria.lima@inova.com",
  },
];

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

  const handleDeleteConfirmed = () => {
    console.log("Deletando chamado:", selectedRow.id);
    // Aqui você conecta com sua API para deletar
    handleCloseDelete();
  };

  const filteredRows = rows.filter(
    (row) =>
      search === "" ||
      row.nome.toLowerCase().includes(search.toLowerCase()) ||
      row.empresa.toLowerCase().includes(search.toLowerCase()) ||
      row.setor.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {rows.length} clientes
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
              filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Avatar initials={row.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)} />
                    {row.nome}
                  </TableCell>
                  <TableCell>{row.empresa}</TableCell>
                  <TableCell>{row.setor}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <IconButton>
                      <Pencil size={18} />
                    </IconButton>
                    <IconButton color="error">
                      <Trash2 size={18} onClick={() => handleOpenDelete(row)}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
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
      {/* Modal de deletar */}
      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDeleteConfirmed}
      />
    </div>
  );
}
