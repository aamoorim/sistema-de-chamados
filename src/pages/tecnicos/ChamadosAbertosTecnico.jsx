import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StatusChip from "../../components/StatusChip";
import { Clock2, ClipboardList} from "lucide-react";
import { Tooltip, IconButton } from "@mui/material";
import ListTableTec from "../../components/tableTec"; // Importando o ListTableTec
import chamadosService from "../../services/chamadosService";
import Spinner from "../../components/LoadingSpinner";
import useIsMobile from "../../hooks/useIsMobile"; // Hook de responsividade
import ModalAtenderChamado from "../../components/Modals/AtenderChamado";
import "./ChamadosAbertos.scss";

export default function ChamadosAbertos() {
  const [loading, setLoading] = useState(true);
  const [chamados, setChamados] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);
  
  // Modal
  const handleOpenModal = (chamado) => {
    const chamadoFormatado = {
      id: chamado.id,
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      criado: new Date(chamado.data_criacao).toLocaleDateString("pt-BR"),
      cliente: chamado.cliente_nome,
      status: chamado.status,
    };
    setSelectedChamado(chamadoFormatado);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedChamado(null);
  };

  // Usando o hook useIsMobile para detectar se a tela é mobile
  const isMobile = useIsMobile(1200);

  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        // Busca chamados abertos
        const data = await chamadosService.getChamadosAbertosDisponiveis();
        setChamados(data);
      } catch (error) {
        console.error("Erro ao buscar chamados", error);
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
    <div className="chamadosAbertos" style={{ minHeight: "100vh" }}>
      <ModalAtenderChamado
        isOpen={open}
        onClose={handleCloseModal}
        chamado={selectedChamado}
      />

      {/* StatusChip */}
      <div className="status-chip-container">
        <StatusChip label="Espera" />
      </div>

      {/* Renderização condicional baseado no tamanho da tela */}
      {isMobile ? (
        // Renderiza os Cards em telas pequenas (abaixo de 1200px)
        <div className="cards-abertos-container">
          {chamados.length > 0 ? (
            chamados.map((chamado) => (
              <div
                key={chamado.id}
                className="chamado-aberto-card espera"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-aberto-main">
                  <div className="chamado-aberto-info">
                    <div className="chamado-aberto-codigo">{chamado.codigo || chamado.id}</div>
                    <div className="chamado-aberto-titulo">{chamado.titulo || chamado.tipo}</div>
                    <div className="chamado-aberto-descricao">{chamado.descricao}</div>
                    <div className="chamado-aberto-data">{chamado.data_criacao || chamado.data}</div>
                  </div>
                </div>
                <div className="card-aberto-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar}</div>
                    <span className="user-name">{chamado.cliente_nome || chamado.usuario}</span>
                    <span className="botao-atender">
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
                    </span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Clock2 size={16} color="#D03E3E" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-calls-message">Nenhum chamado aberto encontrado</div>
          )}
        </div>
      ) : (
        // Renderiza a Tabela em telas grandes (acima de 1200px)
        <ListTableTec className="tabelaAbertos" chamados={chamados} />
      )}

      {/* Outlet para rotas filhas, se necessário */}
      <Outlet />
    </div>
  );
}
