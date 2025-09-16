import React, { useState, useEffect } from 'react';
import { Check, Clock2, Pencil } from 'lucide-react';
import SideBar from '../../components/SideBar';
import '../clientes/clientes.scss';
import Botao from "../../components/Button";
import { ModalCriarChamado } from '../../components/Modals/CriarChamado';
import ModalChamadoDetalhes from '../../components/Modals/DetalhesChamados';
import { SearchProvider } from '../../context/search-context';
import SearchBar from "../../components/search-bar";
import { useAuth } from '../../context/auth-context';
import api from '../../services/api';

const ChamadosCliente = () => {
  const { user } = useAuth();

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openModalCalls, setOpenModalCalls] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [openModalDetails, setOpenModalDetails] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      setChamados([]);
      return;
    }

    const fetchChamados = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/chamados?clienteId=${user.id}`);
        setChamados(response.data);
      } catch (err) {
        setError(err.response?.data?.erro || err.message || 'Erro ao buscar chamados');
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [user]);

  const criarChamado = async (dadosChamado) => {
    try {
      const payload = {
        titulo: dadosChamado.titulo,
        descricao: dadosChamado.descricao,
        cliente_id: user.id,
      };
      const response = await api.post('/chamados', payload);
      setChamados(prev => [...prev, response.data]);
      setOpenModalCalls(false);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao criar chamado');
    }
  };

  const esperaChamados = chamados.filter(c => c.status === 'espera');
  const andamentoChamados = chamados.filter(c => c.status === 'andamento');
  const finalizadosChamados = chamados.filter(c => c.status === 'finalizado');

  const handleEncerrar = (event, chamadoId) => {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  };

  const handleOpenModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setOpenModalDetails(true);
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

  return (
    <div className="tecnico-chamados">
      <div className="main-content-wrapper">
        <div className="header">
          <h1>Meus chamados</h1>
          <Botao onClick={() => setOpenModalCalls(true)}>Novo Chamado</Botao>
          <ModalCriarChamado
            isOpen={openModalCalls}
            onClose={() => setOpenModalCalls(false)}
            onSalvar={criarChamado}
          />
        </div>

        <div className='search-bar'>
          <SearchProvider>
            <SearchBar />
          </SearchProvider>
        </div>

        {loading && <p>Carregando chamados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && chamados.length === 0 && <p>Você não tem chamados cadastrados.</p>}

        {/* Em Espera */}
        <div className="section">
          <div className="section-header espera">
            <Clock2 size={16} /> Em espera
          </div>
          <div className="chamados-list">
            {esperaChamados.map(chamado => (
              <div
                key={chamado.id}
                className="chamado-card espera"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data || chamado.data_criacao}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar || user.nome[0]}</div>
                    <span className="user-name">{chamado.usuario || user.nome}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Clock2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Em Atendimento */}
        <div className="section">
          <div className="section-header andamento">
            <Clock2 size={16} /> Em atendimento
          </div>
          <div className="chamados-list">
            {andamentoChamados.map(chamado => (
              <div
                key={chamado.id}
                className="chamado-card andamento"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data || chamado.data_criacao}</div>
                  </div>
                  {chamado.hasButton && (
                    <button
                      className="btn-encerrar"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEncerrar(e, chamado.id);
                      }}
                    >
                      <Pencil size={13} style={{ marginRight: '4px' }} />
                      Editar
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar || user.nome[0]}</div>
                    <span className="user-name">{chamado.usuario || user.nome}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Clock2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finalizados */}
        <div className="section">
          <div className="section-header finalizado">
            <Check size={16} /> Encerrado
          </div>
          <div className="chamados-list">
            {finalizadosChamados.map(chamado => (
              <div
                key={chamado.id}
                className="chamado-card finalizado"
                onClick={() => handleOpenModal(chamado)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data || chamado.data_criacao}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar || user.nome[0]}</div>
                    <span className="user-name">{chamado.usuario || user.nome}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Check size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-container">
        <SideBar />
      </div>

      <ModalChamadoDetalhes
        isOpen={openModalDetails}
        onClose={() => setOpenModalDetails(false)}
        chamado={chamadoSelecionado}
      />
    </div>
  );
};

export default ChamadosCliente;
