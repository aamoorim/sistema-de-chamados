import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ClipboardList } from 'lucide-react';

function createData(criado, id, titulo, descricao, cliente) {
  return { criado, id, titulo, descricao, cliente };
}

const rows = [
  createData("13/04/25 20:56", "00003", "Rede lenta", "Instalação de Rede", "Carlos Silva"),
  createData("12/04/25 15:20", "00004", "Backup não está funcionando", "Recuperação de Dados", "Carlos Silva"),
  createData("12/04/25 09:01", "00001", "Computador não liga", "Manutenção de Hardware", "Carlos Silva"),
  createData("10/04/25 10:15", "00002", "Instalação de software de gestão", "Suporte de Software", "Ana Oliveira"),
  createData("11/04/25 15:16", "00005", "Meu fone não conecta no computador", "Suporte de Software", "Ana Oliveira"),
];

export default function StyledTable() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Título da seção */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Chip
          label="Espera"
          size="small"
          sx={{
            backgroundColor: "#fde2e4",
            color: "#b91c1c",
            fontWeight: 600,
          }}
        />
        <h2 style={{ color: "#1e3a8a", fontSize: "18px", margin: 0 }}>
          Chamados em Espera
        </h2>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        }}
      >
        <Table aria-label="styled table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                Criado em
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                Id
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                Título
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                Descrição
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                Cliente
              </TableCell>
              <TableCell /> {/* Coluna para o botão */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& td": { borderColor: "#f1f5f9" },
                }}
              >
                <TableCell>{row.criado}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.titulo}</TableCell>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#3b82f6",
                        width: 28,
                        height: 28,
                        fontSize: "0.75rem",
                      }}
                    >
                      {row.cliente
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    {row.cliente}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#15803d",
                      "&:hover": {
                        bgcolor: "#bbf7d0",
                      },
                    }}
                    onClick={() => console.log("Visualizar:", row.id)}
                  >
                    <ClipboardList fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
