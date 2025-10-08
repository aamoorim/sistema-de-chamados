import React, { useEffect, useState } from "react";
import { useSearch } from "../context/search-context";
import { useTecnicos } from "../context/TecnicosContext";
import { useAuth } from "../context/auth-context"
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
import useIsMobile from "../hooks/useIsMobile";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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

// Alert personalizado com cor 604FEB
const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
      sx={{
        backgroundColor: "#604FEB",
        color: "#fff",
        "& .MuiAlert-icon": {
          color: "#fff",
        },
      }}
    />
  );
});

export default function TableAdminTec() {
  const isMobile = useIsMobile(1200);
  const { search } = useSearch();
  const { tecnicos, deleteTecnico, fetchTecnicos, createTecnico } = useTecnicos();
  const { token } = useAuth(); // Token de autenticação

  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // Linha selecionada para exclusão
  
  // const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTecnicoEdit, setSelectedTecnicoEdit] = useState(null);

  // Estados para toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // "success", "error", "warning", "info"

    // Carrega tecnicos assim que o token estiver disponível
    useEffect(() => {
      const load = async () => {
        setLoading(true);
        try {
          await fetchTecnicos();
        } catch (err) {
          console.error("Erro ao carregar tecnicos:", err);
          showToast("error", "Erro ao carregar tecnicos");
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

  const filteredTecnicos = tecnicos.filter((tec) => {
    if (!tec) return false;
    const term = search.toLowerCase();
    return (
      search === "" ||
      (tec.nome && tec.nome.toLowerCase().includes(term)) ||
      (tec.cargo && tec.cargo.toLowerCase().includes(term)) ||
      (tec.email && tec.email.toLowerCase().includes(term))
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
      await deleteTecnico(selectedRow.id);
      await fetchTecnicos();
      setOpenDeleteModal(false);
      showToast("success", `Tecnico "${selectedRow.nome}" deletado com sucesso!`);
      setSelectedRow(null);
    } catch (error) {
      console.error("Erro ao deletar tecnico:", error);
      showToast("error", `Não foi possível deletar o tecnico "${selectedRow?.nome || ''}".`);
    } finally {
      setLoading(false);
    }
  };

  // Abre modal de edição com tecnico selecionado
  const handleOpenEdit = (tecnico) => {
    setSelectedTecnicoEdit(tecnico);
    setOpenEditModal(true);
  };

  // Fecha modal de edição e limpa seleção
  const handleCloseEdit = () => {
    setSelectedTecnicoEdit(null);
    setOpenEditModal(false);
  };

  // Recarrega tecnicos após edição bem-sucedida e mostra toast
    const handleEditSuccess = async () => {
    setLoading(true);
    try {
      await fetchTecnicos(); 
      showToast("success", `Técnico "${selectedTecnicoEdit?.nome}" editado com sucesso!`);
    } catch (error) {
      console.error("Erro ao recarregar técnico:", error);
      showToast("error", `Erro ao atualizar o técnico "${selectedTecnicoEdit?.nome}".`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <LoadingSpinner />; // Mostra spinner enquanto carrega

  return (
    <div style={{ fontFamily: "Lato" }}>
      <div style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {filteredTecnicos.length} de {tecnicos.length} técnicos
      </div>

      {isMobile ? (
        <div className="client-table-mobile">
          {filteredTecnicos.length > 0 ? (
            filteredTecnicos.map((tec) => (
              <div key={tec.id} className="client-card">
                <div><b>Nome:</b> {tec.nome || "-"}</div>
                <div><b>Cargo:</b> {tec.cargo || "-"}</div>
                <div><b>Email:</b> {tec.email || "-"}</div>
                <div className="actions">
                  <IconButton onClick={() => handleOpenEdit(tec)}>
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDelete(tec)}>
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
          <Table aria-label="Tabela de técnicos">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Cargo</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>E-mail</TableCell>
                <TableCell sx={{ color: "#858B99", fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTecnicos.length > 0 ? (
                filteredTecnicos.map((tec) => {
                  const initials = tec.nome
                    ? tec.nome
                        .split(" ")
                        .map((n) => (n && n.length > 0 ? n[0] : ""))
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "??";
                  return (
                    <TableRow key={tec.id} hover>
                      <TableCell>
                        <Avatar initials={initials} />
                        {tec.nome || "-"}
                      </TableCell>
                      <TableCell>{tec.cargo || "-"}</TableCell>
                      <TableCell>{tec.email || "-"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenEdit(tec)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDelete(tec)}>
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

      {/* Modal para confirmação de exclusão */}
            <DeletarPerfil
              isOpen={openDeleteModal}
              onClose={handleCloseDelete}
              onDelete={handleDeleteConfirmed}
              usuario={selectedRow}
            />
      
            {/* Modal para editar tecnico */}
            <ModalEditarTecnico
              isOpen={openEditModal}
              onClose={handleCloseEdit}
              tecnico={selectedTecnicoEdit}
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
