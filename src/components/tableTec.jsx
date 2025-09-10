import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ClipboardList } from 'lucide-react';
import { useState } from "react";
import ModalAtenderChamado from "./Modals/AtenderChamado";

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
  const [open, setOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);

  const handleOpenModal = (chamado) => {
    setSelectedChamado(chamado);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedChamado(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Modal que recebe dados do chamado selecionado */}
      <ModalAtenderChamado 
        isOpen={open} 
        onClose={handleCloseModal}
        chamado={selectedChamado}
      />
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: "12px", 
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Criado em</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow 
                key={row.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#f9fafb' 
                  },
                  '&:last-child td, &:last-child th': { 
                    border: 0 
                  }
                }}
              >
                <TableCell>{row.criado}</TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151' }}>
                  #{row.id}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.titulo}</TableCell>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>{row.cliente}</TableCell>
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
                          boxShadow: "0 2px 8px rgba(21, 128, 61, 0.2)"
                        },
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={() => handleOpenModal(row)}
                    >
                      <ClipboardList size={16} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}