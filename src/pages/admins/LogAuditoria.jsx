import React, { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import MuiAlert from "@mui/material/Alert";
import useIsMobile from "../../hooks/useIsMobile";
import logsService from "../../services/logs_audit";
import "../../styles/auditLogs/AuditLogs.scss";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AvatarInitials({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "??";
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
        fontFamily: "Lato",
      }}
    >
      {initials}
    </span>
  );
}

export default function LogsAuditoria() {
  const theme = useTheme();
  const isMobile = useIsMobile(1200);

  const [logs, setLogs] = useState([]);
  const [previousLogs, setPreviousLogs] = useState([]);
  const [error, setError] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const showToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const fetchLogs = useCallback(async () => {
    try {
      const data = await logsService.listar();
      const logsArray = Array.isArray(data) ? data : [];

      // Atualiza apenas se houver diferença
      if (JSON.stringify(logsArray) !== JSON.stringify(previousLogs)) {
        setLogs(logsArray);
        setPreviousLogs(logsArray);
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar logs:", err);
      setError("Erro ao carregar logs");
      showToast("Erro ao carregar logs", "error");
    }
  }, [previousLogs]);

  useEffect(() => {
    fetchLogs(); // Busca inicial
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return (
    <div className="logs-wrapper">
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{ bgcolor: "#604FEB", color: "#fff" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <div className="logs-info" style={{ marginBottom: 16, color: "#666", fontSize: 14 }}>
        Mostrando {logs.length} de {logs.length} registros
      </div>

      {isMobile ? (
        <div
          className="logs-cards-container"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="logs-card"
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#858B99", fontSize: 13 }}>
                    {new Date(log.data_hora).toLocaleString("pt-BR")}
                  </span>
                  <span className={`badge badge-${log.acao.toLowerCase()}`}>
                    {log.acao}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <AvatarInitials name={log.autor_nome} />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {log.autor_nome || "Usuário desconhecido"}
                  </span>
                </div>
                <div
                  style={{
                    paddingTop: "1vw",
                    color: "#888",
                    fontSize: 15,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {log.descricao}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#999", padding: 32 }}>
              Nenhum registro encontrado
            </div>
          )}
        </div>
      ) : (
        <TableContainer className="logs-table-container"
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "#858B99", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Usuário
                </TableCell>
                <TableCell
                  sx={{ color: "#858B99", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Ação
                </TableCell>
                <TableCell
                  sx={{
                    color: "#858B99",
                    fontWeight: 600,
                    maxWidth: 220,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Descrição
                </TableCell>
                <TableCell
                  sx={{ color: "#858B99", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Data
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        width: "100%",     
                        maxWidth: "none",   
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <AvatarInitials name={log.autor_nome} />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,        
                        }}
                      >
                        {log.autor_nome || "Usuário desconhecido"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className={`badge badge-${log.acao.toLowerCase()}`}>
                        {log.acao}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.descricao}
                    </TableCell>
                    <TableCell>
                      {new Date(log.data_hora).toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ textAlign: "center", padding: 4, color: "#999" }}
                  >
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
