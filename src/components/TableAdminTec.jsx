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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
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

  const [loading, setLoading] = useState(true);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTecnicoEdit, setSelectedTecnicoEdit] = useState(null);

  // Estados para toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // "success", "error", "warning", "info"

  useEffect(() => {
    const loadTecnicos = async () => {
      setLoading(true);
      try {
        await fetchTecnicos();
      } catch (error) {
        console.error("Erro ao carregar técnicos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTecnicos();
  }, []);

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

  const handleOpenDelete = (tecnico) => {
    setSelectedTecnico(tecnico);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setSelectedTecnico(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedTecnico) return;

    setLoading(true);

    try {
      await deleteTecnico(selectedTecnico.id);
      await fetchTecnicos();
      setToastMessage(`Técnico "${selectedTecnico.nome}" deletado com sucesso!`);
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      console.error("Erro ao deletar técnico:", error);
      setToastMessage("Não foi possível deletar técnico.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      handleCloseDelete();
      setLoading(false);
    }
  };

  const handleOpenEdit = (tecnico) => {
    setSelectedTecnicoEdit(tecnico);
    setOpenEditModal(true);
  };

  // Depois de editar, fecha modal, recarrega e mostra toast
  const handleCloseEdit = async (wasEdited = false) => {
    setSelectedTecnicoEdit(null);
    setOpenEditModal(false);

    if (wasEdited) {
      setLoading(true);
      try {
        await fetchTecnicos();
        setToastMessage("Técnico editado com sucesso!");
        setToastSeverity("success");
        setToastOpen(true);
      } catch (error) {
        console.error("Erro ao recarregar técnicos após edição:", error);
        setToastMessage("Erro ao atualizar técnicos após edição.");
        setToastSeverity("error");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Exemplo função para criar técnico (você pode adaptar seu modal/criação)
  const handleCreateTecnico = async (novoTecnicoData) => {
    setLoading(true);
    try {
      await createTecnico(novoTecnicoData);
      await fetchTecnicos();
      setToastMessage(`Técnico "${novoTecnicoData.nome}" criado com sucesso!`);
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      console.error("Erro ao criar técnico:", error);
      setToastMessage("Não foi possível criar técnico.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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

      <DeletarPerfil
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDeleteConfirmed}
        usuario={selectedTecnico}
      />

      <ModalEditarTecnico
        isOpen={openEditModal}
        onClose={() => handleCloseEdit(true)}
        tecnico={selectedTecnicoEdit}
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
