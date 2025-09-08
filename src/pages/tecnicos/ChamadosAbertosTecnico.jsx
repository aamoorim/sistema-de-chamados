import React from "react";
import { Outlet } from 'react-router-dom';
import Box from "@mui/material/Box";
import './chamados.scss';
import Typography from "@mui/material/Typography";
import SearchBar from '../../components/search-bar';
import StatusChip from '../../components/StatusChip';
import { SearchProvider } from '../../context/search-context';
import ListTableTec from "../../components/tableTec";
  
export default function TecEmAndamento() {
  return (
  <Box sx={{ p: 3, minHeight: "100vh", }}>
      {/* Título */}
      <Typography
        
        sx={{ color: "#1e3a8a", fontWeight: 600, mb: 2, ml:2.7}}
      >
        <h1>Chamados</h1>
      </Typography>

      {/* SearchBar */}
      <Box sx={{ ml: 2.7}}>
        <SearchProvider>
          <SearchBar />
        </SearchProvider>
      </Box>

      {/* StatusChip logo abaixo da barra */}
      <Box>
        <StatusChip label="Espera" />
      </Box>

      {/* Tabela */}
      <ListTableTec />
    </Box>
  );
}
