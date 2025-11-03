import React, { useEffect, useState } from "react";
import logsService from "../../services/logs_audit";
import useIsMobile from "../../hooks/useIsMobile";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from "@mui/material";
import "../../styles/auditLogs/AuditLogs.scss";

// Função para formatar JSON
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

// Avatar com ID
function Avatar({ id }) {
  return (
    <span className="log-avatar">
      {id || "??"}
    </span>
  );
}

// Componente Principal
export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const isMobile = useIsMobile(1000);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await logsService.listar();
        setLogs(data);
      } catch (err) {
        console.error("Erro ao carregar logs:", err);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="logs-wrapper">
      <h2 className="titulo">Logs de Auditoria</h2>
      <p className="logs-info">Mostrando {logs.length} registro(s)</p>

      {isMobile ? (
        <div className="logs-cards-container">
          {logs.map((log) => (
            <div className="logs-card" key={log.id}>
              <div className="card-header">
                <small>{new Date(log.data_hora).toLocaleString()}</small>
                <span className={`badge badge-${log.acao.toLowerCase()}`}>{log.acao}</span>
              </div>

              <div className="card-user">
                <Avatar id={log.id_autor} /> Usuário ID {log.id_autor}
              </div>

              <div className="card-desc">{log.descricao}</div>

              {log.valor_antigo && (
                <div className="card-json">
                  <strong>Antes:</strong>
                  <pre>{formatLogJSON(log.valor_antigo)}</pre>
                </div>
              )}

              {log.valor_novo && (
                <div className="card-json">
                  <strong>Depois:</strong>
                  <pre>{formatLogJSON(log.valor_novo)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <TableContainer component={Paper} className="logs-table-container">
          <Table className="logs-table">
            <TableHead>
              <TableRow>
                <TableCell>ID_Autor</TableCell>
                <TableCell>Ação</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Antes</TableCell>
                <TableCell>Depois</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>ID Log</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell style={{ display: "flex", alignItems: "center" }}>
                    <Avatar id={log.id_autor} />
                  </TableCell>

                  <TableCell>
                    <span className={`badge badge-${log.acao.toLowerCase()}`}>{log.acao}</span>
                  </TableCell>

                  <TableCell>{log.descricao}</TableCell>

                  <TableCell className="json-cell">
                    {log.valor_antigo ? <pre>{formatLogJSON(log.valor_antigo)}</pre> : "-"}
                  </TableCell>

                  <TableCell className="json-cell">
                    {log.valor_novo ? <pre>{formatLogJSON(log.valor_novo)}</pre> : "-"}
                  </TableCell>

                  <TableCell>{new Date(log.data_hora).toLocaleString()}</TableCell>

                  <TableCell>{log.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
