import React, { useEffect, useState } from "react";
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
import useIsMobile from "../hooks/useIsMobile";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "../styles/tables/clientTable.scss";

// Componente simples que mostra as iniciais do nome no avatar
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
        background: "#604FEB", // tom roxo
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

// Spinner para mostrar durante carregamentos
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ClientAdminTabe() {
  const isMobile = useIsMobile(1200); // Verifica se é dispositivo móvel (largura menor que 1200px)
  const { search } = useSearch(); // Texto da busca do contexto global
  const { clientes, fetchClientes, deleteCliente } = useClientes(); // Clientes e ações do contexto
  const { token } = useAuth(); // Token de autenticação

  const [loading, setLoading] = useState(true); // Controle de carregamento
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal excluir aberto?
  const [selectedRow, setSelectedRow] = useState(null); // Linha selecionada para exclusão

  const [openEditModal, setOpenEditModal] = useState(false); // Modal editar aberto?
  const [selectedClienteEdit, setSelectedClienteEdit] = useState(null); // Cliente selecionado para editar

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("success"); // success, error, info, warning
  const [toastMessage, setToastMessage] = useState("");

  // Carrega clientes assim que o token estiver disponível
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchClientes();
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        showToast("error", "Erro ao carregar clientes");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  // Função para abrir toast
  const showToast = (severity, message) => {
    setToastSeverity(severity);
    setToastMessage(message);
    setToastOpen(true);
  };

  // Fecha o toast
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  // Filtra os clientes conforme o termo de busca
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

  // Abre modal de excluir para a linha selecionada
  const handleOpenDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  // Fecha modal de exclusão e limpa seleção
  const handleCloseDelete = () => {
    setSelectedRow(null);
    setOpenDeleteModal(false);
  };

  // Confirma exclusão, remove do backend e recarrega lista
  const handleDeleteConfirmed = async () => {
    if (!selectedRow) return;
    setLoading(true);
    try {
      await deleteCliente(selectedRow.id);
      await fetchClientes();
      setOpenDeleteModal(false);
      showToast("success", `Cliente "${selectedRow.nome}" deletado com sucesso!`);
      setSelectedRow(null);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      showToast("error", `Não foi possível deletar o cliente "${selectedRow?.nome || ''}".`);
    } finally {
      setLoading(false);
    }
  };

  // Abre modal de edição com cliente selecionado
  const handleOpenEdit = (cliente) => {
    setSelectedClienteEdit(cliente);
    setOpenEditModal(true);
  };

  // Fecha modal de edição e limpa seleção
  const handleCloseEdit = () => {
    setSelectedClienteEdit(null);
    setOpenEditModal(false);
  };

  // Recarrega clientes após edição bem-sucedida e mostra toast
  const handleEditSuccess = async () => {
    setLoading(true);
    try {
      await fetchClientes();
      showToast("success", `Cliente "${selectedClienteEdit?.nome}" editado com sucesso!`);
    } catch (error) {
      console.error("Erro ao recarregar clientes:", error);
      showToast("error", `Erro ao atualizar o cliente "${selectedClienteEdit?.nome}".`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />; // Mostra spinner enquanto carrega

  return (
    <div style={{ fontFamily: "Lato" }}>
      {/* Informações de quantidade */}
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredRows.length} de {clientes.length} clientes
      </div>

      {/* Layout móvel simplificado */}
      {isMobile ? (
        <div className="client-table-mobile">
          {filteredRows.map((row) => (
            <div key={row.id} className="client-card">
              <div><b>Nome:</b> {row.nome}</div>
              <div><b>Empresa:</b> {row.empresa}</div>
              <div><b>Setor:</b> {row.setor}</div>
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
          ))}
        </div>
      ) : (
        // Layout desktop: tabela completa
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
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>E‑mail</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  // Pega as iniciais para o avatar, máximo 2 letras
                  const initials = row.nome
                    ? row.nome
                        .split(" ")
                        .map((n) => (n && n.length > 0 ? n[0] : ""))
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
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
                        <IconButton color="error" onClick={() => handleOpenDelete(row)}>
                          <Trash2 size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // Mensagem se nenhum cliente encontrado
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
      )}

      {/* Modal para confirmação de exclusão */}
      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDeleteConfirmed}
        usuario={selectedRow}
      />

      {/* Modal para editar cliente */}
      <ModalEditarCliente
        isOpen={openEditModal}
        onClose={handleCloseEdit}
        cliente={selectedClienteEdit}
        onSuccess={handleEditSuccess} // Atualiza lista após edição
      />

      {/* Snackbar para toasts */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{ width: "100%", bgcolor: "#604FEB", color: "#fff" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
