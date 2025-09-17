import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/search-bar";
import StatusChip from "../../components/StatusChip";
import { SearchProvider } from "../../context/search-context";
import ListTableTec from "../../components/tableTec";
import chamadosService from "../../services/chamadosService";
import "./chamados.scss";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Título */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ color: "#1e3a8a", fontWeight: 600, mb: 2, ml: 2.7 }}
      >
        Chamados
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
