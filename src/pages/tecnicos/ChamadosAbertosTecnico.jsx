import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/search-bar";
import StatusChip from "../../components/StatusChip";
import { SearchProvider } from "../../context/search-context";
import ListTableTec from "../../components/tableTec";
import chamadosService from "../../services/chamadosService";
import Spinner from "../../components/LoadingSpinner";
import "./ChamadosAbertos.scss";

export default function TecEmAndamento() {
  const [loading, setLoading] = useState(true);
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        // Busca chamados abertos do técnico 
        const data = await chamadosService.getChamadosAbertosDisponiveis();
        setChamados(data);
      } catch (error) {
        console.error("Erro ao buscar chamados do técnico", error);
        setChamados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box className="chamadosAbertos" sx={{ minHeight: "100vh" }}>
      {/* Título */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ color: "#1e3a8a", fontWeight: 600, mb: 2, ml: 2.7 }}
      >
        Chamados Abertos
      </Typography>

      {/* SearchBar */}
      <Box sx={{ ml: 2.7 }}>
        <SearchProvider>
          <SearchBar />
        </SearchProvider>
      </Box>

      {/* StatusChip logo abaixo da barra */}
      <Box>
        <StatusChip label="Espera" />
      </Box>

      {/* Tabela */}
      <ListTableTec chamados={chamados} />

      {/* Outlet para rotas filhas, se necessário */}
      <Outlet />
    </Box>
  );
}
