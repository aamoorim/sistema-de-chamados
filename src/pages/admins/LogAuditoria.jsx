import React, { useEffect, useState } from "react";
import logsService from "../../services/logs_audit";
import useIsMobile from "../../hooks/useIsMobile";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from "@mui/material";
import "../../styles/auditLogs/AuditLogs.scss";

// Função para formatar JSON (mantida caso precise em outro lugar)
function formatLogJSON(jsonString) {
  if (!jsonString) return "-";
  try {
    const obj = JSON.parse(jsonString);
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  } catch {
    return jsonString;
  }
}

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const isMobile = useIsMobile(1000);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await logsService.listar();
        // Garante que seja array
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar logs:", err);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="logs-wrapper">
      <p className="logs-info">Mostrando {logs.length} registro(s)</p>

      {isMobile ? (
        // ---- VERSÃO MOBILE ----
        <div className="logs-cards-container">
          {logs.map((log) => (
            <div className="logs-card" key={log.id}>
              <div className="card-header">
                <small>{new Date(log.data_hora).toLocaleString()}</small>
                <span className={`badge badge-${log.acao.toLowerCase()}`}>{log.acao}</span>
              </div>

              <div className="card-user">
                <strong>{log.autor_nome || "Usuário desconhecido"}</strong>
              </div>

              <div className="card-desc">{log.descricao}</div>
            </div>
          ))}
        </div>
      ) : (
        <TableContainer component={Paper} className="logs-table-container">
          <Table className="logs-table">
            <TableHead>
              <TableRow>
                <TableCell>Usuário</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.autor_nome || "Usuário desconhecido"}</TableCell>

                  <TableCell>
                    <span className={`badge badge-${log.acao.toLowerCase()}`}>{log.acao}</span>
                  </TableCell>

                  <TableCell>{log.descricao}</TableCell>

                  <TableCell>{new Date(log.data_hora).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
