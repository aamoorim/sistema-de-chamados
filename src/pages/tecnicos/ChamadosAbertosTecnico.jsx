import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import StatusChip from "../../components/StatusChip";
import { Clock2, ClipboardList } from "lucide-react";
import { Tooltip, IconButton } from "@mui/material";
import ListTableTec from "../../components/tableTec"; 
import chamadosService from "../../services/chamadosService";
import Spinner from "../../components/LoadingSpinner";
import useIsMobile from "../../hooks/useIsMobile"; 
import ModalAtenderChamado from "../../components/Modals/AtenderChamado";
import "./ChamadosAbertos.scss";

export default function ChamadosAbertos() {
  const [loading, setLoading] = useState(false); 
  const [chamados, setChamados] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [previousChamados, setPreviousChamados] = useState([]); // Armazena os chamados anteriores para comparação

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

  // Função para buscar os chamados
  const fetchChamados = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chamadosService.getChamadosAbertosDisponiveis();
      
      // Só atualiza se os dados forem diferentes dos anteriores
      if (JSON.stringify(data) !== JSON.stringify(previousChamados)) {
        setChamados(data); // Atualiza os chamados
        setPreviousChamados(data); // Atualiza a lista anterior
      }
    } catch (error) {
      console.error("Erro ao buscar chamados", error);
      setChamados([]); // Caso haja erro, zera os chamados
    } finally {
      setLoading(false); // Para o spinner após a atualização ou erro
    }
  }, [previousChamados]); // Agora depende dos chamados anteriores

  // Carrega a lista de chamados apenas na primeira vez que o componente for montado
  useEffect(() => {
    fetchChamados(); // Carrega inicialmente os chamados

    // Polling ou atualização periódica
    const interval = setInterval(async () => {
      try {
        const data = await chamadosService.getChamadosAbertosDisponiveis();
        // Só atualiza se os dados forem diferentes dos anteriores
        if (JSON.stringify(data) !== JSON.stringify(previousChamados)) {
          setChamados(data); // Atualiza os chamados
          setPreviousChamados(data); // Atualiza os dados anteriores
        }
      } catch (err) {
        console.error("Erro ao atualizar chamados:", err);
      }
    }, 2000); // Atualiza a cada 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [previousChamados, fetchChamados]); // O useEffect depende dos dados anteriores e da função fetchChamados

  if (loading) {
    return <Spinner />; // Exibe o spinner apenas quando os dados estão sendo carregados
  }

  return (
    <div className="chamadosAbertos" style={{ minHeight: "100vh" }}>
      <ModalAtenderChamado
        isOpen={open}
        onClose={handleCloseModal}
        chamado={selectedChamado}
        onAtenderChamado={() => {
          if (selectedChamado) {
            atenderChamado(selectedChamado.id);
            handleCloseModal();
          }
        }} // Passando a função de atender chamado para o modal
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
                          onClick={() => handleOpenModal(chamado)}
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
