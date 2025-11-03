import React, { useState, useEffect } from "react";
import { Check, Clock2, CircleCheckBig } from "lucide-react";
import "./chamados.scss";
import ModalChamadoDetalhes from "../../components/Modals/DetalhesChamados";
import chamadoService from "../../services/chamadosService";
import { useAuth } from "../../context/auth-context";
import api from "../../services/api";
import Botao from "../../components/Button.jsx";
import { SearchProvider, useSearch } from "../../context/search-context";
import SearchBar from "../../components/search-bar";
import Spinner from "../../components/LoadingSpinner";

function ChamadosTecnicoInner() {
  const { token } = useAuth();
  const { search } = useSearch(); // ✅ pega texto digitado na barra de busca

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

  // ✅ Filtro aplicado com base no search
  const termo = search?.toLowerCase() || "";

  const chamadosFiltrados = chamados.filter((c) => {
    return (
      termo === "" ||
      c.id?.toString().includes(termo) ||
      c.codigo?.toLowerCase().includes(termo) ||
      c.titulo?.toLowerCase().includes(termo) ||
      c.descricao?.toLowerCase().includes(termo) ||
      c.cliente_nome?.toLowerCase().includes(termo) ||
      c.data_criacao?.toLowerCase().includes(termo)
    );
  });

  // Separa por status
  const andamentoChamados = chamadosFiltrados.filter((c) =>
    ["em_andamento", "em andamento", "andamento"].some(s => c.status?.toLowerCase().includes(s))
  );

  const finalizadosChamados = chamadosFiltrados.filter((c) =>
    ["encerr", "finaliz", "conclu", "fech"].some(s => c.status?.toLowerCase().includes(s))
  );

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="tecnico-chamados">
      <div className="search-bar">
        <SearchBar />
      </div>

      {/* Em Atendimento */}
      <div className="section-tecnico">
        <div className="section-tecnico-header andamento">
          <Clock2 size={16} className="status" /> Em atendimento ({andamentoChamados.length})
        </div>

        <div className="chamados-tecnico-list">
          {andamentoChamados.length > 0 ? (
            andamentoChamados.map((chamado) => (
              <div
                key={chamado.id}
                className="chamado-tecnico-card andamento"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-tecnico-main">
                  <div className="chamado-tecnico-info">
                    <div className="chamado-tecnico-codigo">{chamado.codigo || chamado.id}</div>
                    <div className="chamado-tecnico-titulo">{chamado.titulo || chamado.tipo}</div>
                    <div className="chamado-tecnico-descricao">{chamado.descricao}</div>
                    <div className="chamado-tecnico-data">{chamado.data_criacao || chamado.data}</div>
                  </div>
                  <Botao
                    onClick={(e) => handleEncerrar(e, chamado.id)}
                    text={encerrandoId === chamado.id ? "" : "Encerrar"}
                    icon={encerrandoId === chamado.id ? null : CircleCheckBig}
                  >
                    {encerrandoId === chamado.id && <ButtonSpinner />}
                  </Botao>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#64748b", paddingLeft: 8 }}>Nenhum chamado em andamento</p>
          )}
        </div>
      </div>

      {/* Encerrados */}
      <div className="section-tecnico">
        <div className="section-tecnico-header finalizado">
          <Check size={16} className="status" /> Encerrados ({finalizadosChamados.length})
        </div>

        <div className="chamados-tecnico-list">
          {finalizadosChamados.length > 0 ? (
            finalizadosChamados.map((chamado) => (
              <div
                key={chamado.id}
                className="chamado-tecnico-card finalizado"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-tecnico-main">
                  <div className="chamado-tecnico-info">
                    <div className="chamado-tecnico-codigo">{chamado.codigo || chamado.id}</div>
                    <div className="chamado-tecnico-titulo">{chamado.titulo || chamado.tipo}</div>
                    <div className="chamado-tecnico-descricao">{chamado.descricao}</div>
                    <div className="chamado-tecnico-data">{chamado.data_criacao || chamado.data}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#64748b", paddingLeft: 8 }}>Nenhum chamado encerrado</p>
          )}
        </div>
      </div>

      <ModalChamadoDetalhes
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        chamado={chamadoSelecionado}
        tecnicos={tecnicos.length > 0 ? tecnicos : []}
      />
    </div>
  );
}

// ✅ Agora o componente final envolve tudo com SearchProvider
export default function ChamadosTecnico() {
  return (
    <SearchProvider>
      <ChamadosTecnicoInner />
    </SearchProvider>
  );
}
