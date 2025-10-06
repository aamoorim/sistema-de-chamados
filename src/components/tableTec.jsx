import React, { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { ClipboardList } from "lucide-react";
import { ChamadosAbertosTecnicosContext } from "../context/ChamadosAbertosTecnicosContext";
import ModalAtenderChamado from "./Modals/AtenderChamado";
import useIsMobile from "../hooks/useIsMobile";
import Botao from "./Button.jsx"
import "../styles/tables/listTable.scss";

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

export default function ListTableTec() {
  const { chamados, loading, error } = useContext(ChamadosAbertosTecnicosContext);

  const [open, setOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const isMobile = useIsMobile(900);

  const handleOpenModal = (chamado) => {
    const chamadoFormatado = {
      id: chamado.id,
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      criado: new Date(chamado.data_criacao).toLocaleDateString("pt-BR"),
      cliente: chamado.cliente_nome,
    };
    setSelectedChamado(chamadoFormatado);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedChamado(null);
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <ModalAtenderChamado
        isOpen={open}
        onClose={handleCloseModal}
        chamado={selectedChamado}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600 }}>Criado em</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descrição</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chamados.length > 0 ? (
                chamados.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell>
                      {new Date(row.data_criacao).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                      #{row.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.titulo}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.descricao}
                    </TableCell>
                    <TableCell>{row.cliente_nome}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Atender chamado" arrow placement="top">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#dcfce7",
                            color: "#15803d",
                            border: "1px solid #bbf7d0",
                            "&:hover": {
                              bgcolor: "#bbf7d0",
                              transform: "scale(1.05)",
                              boxShadow: "0 2px 8px rgba(21, 128, 61, 0.2)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => handleOpenModal(row)}
                        >
                          <ClipboardList size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", padding: "40px", color: "#999" }}
                  >
                    Nenhum chamado aberto encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
