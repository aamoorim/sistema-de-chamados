import React, { useState, useEffect, forwardRef, useMemo } from "react";
import { Plus, Check, Clock2 } from "lucide-react";
import SideBar from "../../components/SideBar";
import "../clientes/clientes.scss";
import Botao from "../../components/Button";
import { ModalCriarChamado } from "../../components/Modals/CriarChamado";
import ModalChamadoDetalhes from "../../components/Modals/DetalhesChamados";
import EditTicketModal from "../../components/Modals/EditarChamado";
import { SearchProvider, useSearch } from "../../context/search-context";
import SearchBar from "../../components/search-bar";
import { useAuth } from "../../context/auth-context";
import chamadosService from "../../services/chamadosService";

import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Conteúdo que usa o contexto de busca
const ChamadosClienteContent = () => {
  const { user } = useAuth();
  const { search } = useSearch(); // <-- usa "search" conforme seu contexto

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModalCalls, setOpenModalCalls] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Normaliza texto (remove acentos e deixa minúsculo)
  const normalizar = (txt = "") =>
    txt
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Polling inteligente + detectar atribuição de técnico
  useEffect(() => {
    if (!user || !user.id) {
      setChamados([]);
      return;
    }

    let intervalId;

    const fetchChamados = async (showSpinner = false) => {
      if (showSpinner) setLoading(true);
      try {
        const data = await chamadosService.getChamadosDoCliente();

        const changed = data.filter((novo) => {
          const antigo = chamados.find((c) => c.id === novo.id);
          if (!antigo) return false;
          if (antigo.status !== novo.status) return true;
          if (antigo.tecnico !== novo.tecnico) return true;
          return false;
        });

        const dataString = JSON.stringify(data);
        const currentString = JSON.stringify(chamados);

        if (dataString !== currentString) {
          setChamados(data);

          changed.forEach((c) => {
            const antigo = chamados.find((x) => x.id === c.id);
            if (antigo) {
              if (
                c.status?.toLowerCase() === "em_andamento" &&
                antigo.status !== c.status
              ) {
                showToast(`Chamado #${c.id} foi atendido por um técnico!`);
              }
              if (
                c.status?.toLowerCase() === "encerrado" &&
                antigo.status !== c.status
              ) {
                showToast(`Chamado #${c.id} finalizado!`);
              }
            }
          });

          if (!showSpinner) setLoading(true);
          setTimeout(() => setLoading(false), 1000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setChamados([]);
        setLoading(false);
      }
    };

    // fetch inicial
    fetchChamados(true);

    // polling
    intervalId = setInterval(() => {
      fetchChamados(false);
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // removi "chamados" das deps para evitar loop infinito de fetch

  const showToast = (message) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const criarChamadoHandler = async (dadosChamado) => {
    if (!dadosChamado.titulo || !dadosChamado.descricao) {
      alert("Título e descrição são obrigatórios.");
      return;
    }
    try {
      const novoChamado = await chamadosService.criarChamado(dadosChamado);
      if (novoChamado && novoChamado.id) {
        setChamados((prev) => [novoChamado, ...prev]);
        setOpenModalCalls(false);
        showToast("Chamado criado com sucesso!");
      } else {
        alert("Não foi possível criar o chamado. Tente novamente.");
      }
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao criar chamado");
    }
  };

  const handleAtualizarChamado = async (dadosAtualizados) => {
    try {
      const atualizado = await chamadosService.atualizarChamado(
        chamadoSelecionado.id,
        {
          titulo: dadosAtualizados.title,
          descricao: dadosAtualizados.description,
        }
      );
      setChamados((prev) =>
        prev.map((chamado) =>
          chamado.id === atualizado.id ? atualizado : chamado
        )
      );
      setOpenModalEditar(false);

      if (
        ["em_andamento", "encerrado"].includes(
          atualizado.status?.toLowerCase()
        )
      ) {
        const mensagem =
          atualizado.status.toLowerCase() === "em_andamento"
            ? "Chamado atendido!"
            : "Chamado finalizado!";
        showToast(mensagem);
      }
    } catch {
      alert("Erro ao atualizar chamado.");
    }
  };

  // Filtragem otimizada com useMemo
  const chamadosFiltrados = useMemo(() => {
    if (!search) return chamados;
    const termo = normalizar(search);
    return chamados.filter((c) => {
      return (
        normalizar(c.titulo || "").includes(termo) ||
        normalizar(c.descricao || "").includes(termo) ||
        normalizar(c.status || "").includes(termo) ||
        (c.id !== undefined && c.id.toString().includes(termo))
      );
    });
  }, [chamados, search]);

  const esperaChamados = chamadosFiltrados.filter(
    (c) => c.status?.toLowerCase() === "aberto"
  );
  const andamentoChamados = chamadosFiltrados.filter(
    (c) => c.status?.toLowerCase() === "em_andamento"
  );
  const finalizadosChamados = chamadosFiltrados.filter(
    (c) => c.status?.toLowerCase() === "encerrado"
  );

  const handleOpenModalDetails = (chamado) => {
    setChamadoSelecionado(chamado);
    setOpenModalDetails(true);
  };

  const handleOpenModalEditar = (chamado, e) => {
    e.stopPropagation();
    setChamadoSelecionado(chamado);
    setOpenModalEditar(true);
  };

  if (!user) {
    return (
      <div className="tecnico-chamados">
        <div className="main-content-wrapper">
          <p>Você precisa estar logado para ver seus chamados.</p>
        </div>
        <div className="sidebar-container">
          <SideBar />
        </div>
      </div>
    );
  }

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
        backgroundColor: "rgba(255,255,255,0.7)",
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div className="tecnico-chamados">
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ bgcolor: "#604FEB", color: "#fff" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <div className="main-content-wrapper">
        <div className="header">
          <h1>Meus chamados</h1>
          <div className="botao-novo">
            <Botao icon={Plus} onClick={() => setOpenModalCalls(true)}>
              Novo Chamado
            </Botao>
          </div>
          <ModalCriarChamado
            isOpen={openModalCalls}
            onClose={() => setOpenModalCalls(false)}
            onSalvar={criarChamadoHandler}
          />
        </div>

        <div className="search-bar">
          <SearchBar />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {[
              {
                titulo: "Em Espera",
                icone: <Clock2 size={16} />,
                classe: "espera",
                lista: esperaChamados,
              },
              {
                titulo: "Em Atendimento",
                icone: <Clock2 size={16} />,
                classe: "andamento",
                lista: andamentoChamados,
              },
              {
                titulo: "Encerrado",
                icone: <Check size={16} />,
                classe: "finalizado",
                lista: finalizadosChamados,
              },
            ].map((secao, idx) => (
              <div className="section" key={idx}>
                <div className={`section-header ${secao.classe}`}>
                  {secao.icone} {secao.titulo}
                </div>
                <div className="chamados-list">
                  {secao.lista.length > 0 ? (
                    secao.lista.map((chamado) => (
                      <div
                        key={chamado.id}
                        className={`chamado-card ${secao.classe}`}
                        onClick={() => handleOpenModalDetails(chamado)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-main">
                          <div className="chamado-info">
                            <div className="chamado-codigo">#{chamado.id}</div>
                            <div className="chamado-titulo">
                              {chamado.titulo}
                            </div>
                            <div className="chamado-descricao">
                              {chamado.descricao}
                            </div>
                            <div className="chamado-data">
                              {new Date(chamado.data_criacao).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="user-info">
                            <div className="user-avatar">
                              {user?.nome?.[0] || "U"}
                            </div>
                            <span className="user-name">
                              {user?.nome || "Usuário"}
                            </span>
                            <div className={`status-icon ${secao.classe}`}>
                              {secao.icone}
                            </div>

                            {chamado.status?.toLowerCase() !== "encerrado" && (
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenModalEditar(chamado, e)}
                                sx={{ marginLeft: 1 }}
                                aria-label="Editar chamado"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#64748b", paddingLeft: "8px" }}>
                      Nenhum chamado nesta seção.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="sidebar-container">
        <SideBar />
      </div>

      <ModalChamadoDetalhes
        isOpen={openModalDetails}
        onClose={() => setOpenModalDetails(false)}
        chamado={chamadoSelecionado}
      />

      <EditTicketModal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        ticket={chamadoSelecionado}
        onSave={handleAtualizarChamado}
      />
    </div>
  );
};

// Componente exportado, envolvendo o conteúdo com o Provider
const ChamadosCliente = () => (
  <SearchProvider>
    <ChamadosClienteContent />
  </SearchProvider>
);

export default ChamadosCliente;
