import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { ClipboardList } from "lucide-react";
import { styled } from "@mui/material/styles";
import "../pages/tecnicos/ChamadosAbertos.scss";

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

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  '& .MuiTableHead-root': {
    '& .MuiTableCell-head': {
      fontWeight: 600,
      color: '#6b7280',
      fontSize: '14px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #f1f5f9',
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableCell-root': {
      fontSize: '14px',
      color: '#374151',
      borderColor: '#f1f5f9',
    },
    '& .MuiTableRow-root:last-child': {
      '& .MuiTableCell-root': {
        border: 0,
      }
    }
  }
}));

const ClienteBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#3b82f6',
  width: 28,
  height: 28,
  fontSize: '0.75rem',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#E3E5E8',
  color: '#2BAF06 ',
  width: 32,
  height: 32,
  borderRadius: 5,
  '&:hover': {
    backgroundColor: '#bbf7d0',
  }
}));

const TituloCell = styled(TableCell)(({ theme }) => ({
  fontWeight: '600 !important',
}));

export default function ListTableTec() {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Aqui você pode adicionar seu próprio título/chip separadamente */}
      
      <StyledTableContainer component={Paper}>
        <Table aria-label="styled table">
          <TableHead>
            <TableRow>
              <TableCell>Criado em</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.criado}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TituloCell>{row.titulo}</TituloCell>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>
                  <ClienteBox>
                    <StyledAvatar>
                      {getInitials(row.cliente)}
                    </StyledAvatar>
                    {row.cliente}
                  </ClienteBox>
                </TableCell>
                <TableCell align="right">
                  <ActionButton
                    size="small"
                    onClick={() => console.log("Visualizar:", row.id)}
                  >
                    <ClipboardList size={18} />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}