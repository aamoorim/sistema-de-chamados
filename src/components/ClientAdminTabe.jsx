import { useSearch } from "../context/search-context";
import { useClientes } from "../context/ClientesContext";
import { useAuth } from "../context/auth-context";
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
import { ModalEditarCliente } from "./Modals/EditarCliente";
import { useState, useEffect } from "react";

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

// Spinner (mesmo do listTable)
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

export default function ClientTable() {
  const { search } = useSearch();
  const { clientes, setClientes } = useClientes();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedClienteEdit, setSelectedClienteEdit] = useState(null);

  useEffect(() => {
    // Simula carregamento (caso useClientes já tenha os dados)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Delay pequeno só para exibir o spinner

    return () => clearTimeout(timeout);
  }, [clientes]);

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

      setClientes((prev) => prev.filter((c) => c.id !== selectedRow.id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Não foi possível deletar cliente. Verifique permissão ou token.");
    } finally {
      handleCloseDelete();
    }
  };

  const handleOpenEdit = (cliente) => {
    setSelectedClienteEdit(cliente);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedClienteEdit(null);
    setOpenEditModal(false);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ fontFamily: "Lato" }}>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {clientes.length} clientes
      </div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
          marginBottom: 4,
          overflowX: "auto",
          "@media (max-width: 768px)": {
            "& table": {
              minWidth: "700px",
            },
          },
        }}
      >
        <Table aria-label="tabela de clientes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Empresa</TableCell>
              <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Setor</TableCell>
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
                    <TableCell>{row.empresa || "-"}</TableCell>
                    <TableCell>{row.setor || "-"}</TableCell>
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
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
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
        usuario={selectedRow}
      />

      {/* Modal de editar */}
      <ModalEditarCliente
        isOpen={openEditModal}
        onClose={handleCloseEdit}
        cliente={selectedClienteEdit}
      />
    </div>
  );
}
