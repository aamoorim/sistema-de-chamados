import React, { useState, useEffect } from "react";
import { Check, Clock2, CircleCheckBig } from "lucide-react";
import "./chamados.scss";
import ModalChamadoDetalhes from "../../components/Modals/DetalhesChamados";
import chamadoService from "../../services/chamadosService";
import { useAuth } from "../../context/auth-context";
import api from "../../services/api";
import Botao from "../../components/Button.jsx";

export default function ChamadosTecnico() {
  const { token } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [encerrandoId, setEncerrandoId] = useState(null);

  const recarregarChamados = async () => {
    if (!token) return;
    setLoading(true);

    try {
      let data;
      try {
        const response = await api.get("/chamados/todos");
        data = response.data;
      } catch {
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
      } catch {
        setTecnicos([]);
      }
    };

    fetchUsuarioAtual();
  }, [token]);

  const andamentoChamados = chamados.filter((c) => {
    const status = c.status?.toLowerCase()?.trim();
    return (
      status === "em_andamento" ||
      status === "em andamento" ||
      status === "andamento" ||
      status?.includes("andamento")
    );
  });

  const finalizadosChamados = chamados.filter((c) => {
    const status = c.status?.toLowerCase()?.trim();
    return (
      status === "encerrado" ||
      status === "finalizado" ||
      status === "concluido" ||
      status === "concluído" ||
      status === "fechado" ||
      status?.includes("encerr") ||
      status?.includes("finaliz") ||
      status?.includes("conclu")
    );
  });

  const handleEncerrar = async (event, chamadoId) => {
    event.stopPropagation();
    setEncerrandoId(chamadoId);

    try {
      await chamadoService.atualizarChamado(chamadoId, { status: "encerrado" });

      setChamados((prev) =>
        prev.map((chamado) =>
          chamado.id === chamadoId ? { ...chamado, status: "encerrado" } : chamado
        )
      );
    } catch (error) {
      console.error("Erro ao encerrar chamado:", error);
      alert("Erro ao encerrar chamado. Tente novamente.");
    } finally {
      setEncerrandoId(null);
    }
  };

  const handleOpenModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setOpenModal(true);
  };

  const ButtonSpinner = () => (
    <div
      style={{
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #604FEB",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        animation: "spin 1s linear infinite",
        margin: "0 auto",
      }}
    />
  );

  return (
    <div className="tecnico-chamados">
      <div className="header">
        <h1>Meus chamados</h1>
      </div>

      {loading && (
        <p style={{ paddingLeft: 8, color: "#64748b" }}>
          Carregando chamados...
        </p>
      )}

      {!loading && (
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
                      <Botao className="btn-encerrar"
                        onClick={(e) => handleEncerrar(e, chamado.id)}
                        text={encerrandoId === chamado.id ? "" : "Encerrar"}
                        icon={encerrandoId === chamado.id ? null : CircleCheckBig}
                        sx={{
                          height: 35,
                          fontSize: "1rem",
                          "& svg": {
                            fontSize: 18,
                          },
                          borderRadius: "0.5rem",
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {encerrandoId === chamado.id && <ButtonSpinner />}
                      </Botao>
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
                <p style={{ color: "#64748b", paddingLeft: 8 }}>Nenhum chamado em andamento</p>
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
                <p style={{ color: "#64748b", paddingLeft: 8 }}>Nenhum chamado encerrado</p>
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
