import React, { useState, useEffect } from "react";
import { Check, Clock2, CircleCheckBig } from "lucide-react";
import "./chamados.scss";
import ModalChamadoDetalhes from "../../components/Modals/DetalhesChamados";
import chamadoService from "../../services/chamadosService";
import { useAuth } from "../../context/auth-context";
import api from "../../services/api";

export default function ChamadosTecnico() {
  const { token } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar TODOS os chamados (incluindo encerrados)
  const recarregarChamados = async () => {
    if (!token) return;
    setLoading(true);
    
    try {
      // Primeiro tenta o endpoint que retorna todos os chamados
      let data;
      try {
        const response = await api.get("/chamados/todos");
        data = response.data;
        console.log(`✅ Buscou todos os chamados: ${data.length} encontrados`);
      } catch (error) {
        // Fallback para o endpoint original se /todos não existir
        console.log("⚠️ Endpoint /todos não disponível, usando /chamados");
        data = await chamadoService.getChamadosDoCliente();
      }
      
      setChamados(data);
      
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      setChamados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recarregarChamados();
  }, [token]);

  useEffect(() => {
    const fetchUsuarioAtual = async () => {
      if (!token) return;

      try {
        const response = await chamadoService.getUsuarioAtual();
        if (response && response.id) setTecnicos([response]);
      } catch {
        fetchTecnicosCompleta();
      }
    };

    const fetchTecnicosCompleta = async () => {
      try {
        const response = await chamadoService.getTecnicos();
        setTecnicos(response);
      } catch (error) {
        setTecnicos([]);
      }
    };

    fetchUsuarioAtual();
  }, [token]);

  // Filtros para os chamados
  const andamentoChamados = chamados.filter((c) => {
    const status = c.status?.toLowerCase()?.trim();
    return status === "em_andamento" || 
           status === "em andamento" ||
           status === "andamento" ||
           status?.includes("andamento");
  });

  const finalizadosChamados = chamados.filter((c) => {
    const status = c.status?.toLowerCase()?.trim();
    return status === "encerrado" || 
           status === "finalizado" || 
           status === "concluido" || 
           status === "concluído" ||
           status === "fechado" ||
           status?.includes("encerr") ||
           status?.includes("finaliz") ||
           status?.includes("conclu");
  });

  const handleEncerrar = async (event, chamadoId) => {
    event.stopPropagation();

    const button = event.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);

    try {
      console.log(`Encerrando chamado ${chamadoId}...`);
      
      // Atualiza no backend
      await chamadoService.atualizarChamado(chamadoId, { status: "encerrado" });
      
      // Atualiza o estado local
      setChamados((prev) =>
        prev.map((chamado) =>
          chamado.id === chamadoId
            ? { ...chamado, status: "encerrado" }
            : chamado
        )
      );
      
      console.log(`✅ Chamado ${chamadoId} encerrado com sucesso`);
      
      // Recarrega dados para garantir sincronização
      setTimeout(() => {
        recarregarChamados();
      }, 500);
      
    } catch (error) {
      console.error("Erro ao encerrar chamado:", error);
      alert("Erro ao encerrar chamado. Tente novamente.");
    }
  };

  const handleOpenModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setOpenModal(true);
  };

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

  return (
    <div className="tecnico-chamados">
      <div className="header">
        <h1>Meus chamados</h1>
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <div>Token: {token ? "✓ Presente" : "✗ Ausente"}</div>
          <div>Total: {chamados.length} chamados</div>
          <div>Em andamento: {andamentoChamados.length}</div>
          <div>Encerrados: {finalizadosChamados.length}</div>
          <div>Técnicos: {tecnicos.length}</div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Em Atendimento */}
          <div className="section">
            <div className="section-header andamento">
              <Clock2 size={16} /> Em atendimento ({andamentoChamados.length})
            </div>
            <div className="chamados-list">
              {andamentoChamados.length > 0 ? (
                andamentoChamados.map((chamado) => (
                  <div
                    key={chamado.id}
                    className="chamado-card andamento"
                    onClick={() => handleOpenModal(chamado)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-main">
                      <div className="chamado-info">
                        <div className="chamado-codigo">{chamado.codigo || chamado.id}</div>
                        <div className="chamado-titulo">{chamado.titulo || chamado.tipo}</div>
                        <div className="chamado-descricao">{chamado.descricao}</div>
                        <div className="chamado-data">{chamado.data_criacao || chamado.data}</div>
                      </div>
                      <button
                        className="btn-encerrar"
                        onClick={(e) => handleEncerrar(e, chamado.id)}
                      >
                        <CircleCheckBig size={15} style={{ marginRight: "4px" }} />
                        Encerrar
                      </button>
                    </div>
                    <div className="card-footer">
                      <div className="user-info">
                        <div className="user-avatar">{chamado.avatar}</div>
                        <span className="user-name">{chamado.cliente_nome || chamado.usuario}</span>
                        <div className={`status-icon ${chamado.status}`}>
                          <Clock2 size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#64748b", paddingLeft: "8px" }}>
                  Nenhum chamado em andamento
                </p>
              )}
            </div>
          </div>

          {/* Encerrados */}
          <div className="section">
            <div className="section-header finalizado">
              <Check size={16} /> Encerrados ({finalizadosChamados.length})
            </div>
            <div className="chamados-list">
              {finalizadosChamados.length > 0 ? (
                finalizadosChamados.map((chamado) => (
                  <div
                    key={chamado.id}
                    className="chamado-card finalizado"
                    onClick={() => handleOpenModal(chamado)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-main">
                      <div className="chamado-info">
                        <div className="chamado-codigo">{chamado.codigo || chamado.id}</div>
                        <div className="chamado-titulo">{chamado.titulo || chamado.tipo}</div>
                        <div className="chamado-descricao">{chamado.descricao}</div>
                        <div className="chamado-data">{chamado.data_criacao || chamado.data}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="user-info">
                        <div className="user-avatar">{chamado.avatar}</div>
                        <span className="user-name">{chamado.cliente_nome || chamado.usuario}</span>
                        <div className={`status-icon ${chamado.status}`}>
                          <Check size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#64748b", paddingLeft: "8px" }}>
                  Nenhum chamado encerrado
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <ModalChamadoDetalhes
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        chamado={chamadoSelecionado}
        tecnicos={tecnicos.length > 0 ? tecnicos : []}
      />
    </div>
  );
}