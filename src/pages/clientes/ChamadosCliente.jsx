import React, { useState, useEffect } from 'react';
import { Check, Clock2 } from 'lucide-react';
import SideBar from '../../components/SideBar';
import '../clientes/clientes.scss';
import Botao from "../../components/Button";
import { ModalCriarChamado } from '../../components/Modals/CriarChamado';
import ModalChamadoDetalhes from '../../components/Modals/DetalhesChamados';
import { SearchProvider } from '../../context/search-context';
import SearchBar from "../../components/search-bar";
import { useAuth } from '../../context/auth-context';
import chamadosService from '../../services/chamadosService';

const ChamadosCliente = () => {
  const { user } = useAuth();

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);

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
      try {
        const data = await chamadosService.getChamadosDoCliente();
        setChamados(data);
      } catch {
        setChamados([]); // Se erro, deixar vazio (sem mostrar erro)
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, [user]);

  const criarChamadoHandler = async (dadosChamado) => {
    if (!dadosChamado.titulo || !dadosChamado.descricao) {
      alert("Título e descrição são obrigatórios.");
      return;
    }

    try {
      const novoChamado = await chamadosService.criarChamado(dadosChamado);
      if (novoChamado && novoChamado.id) {
        setChamados(prev => [novoChamado, ...prev]);
        setOpenModalCalls(false);
      } else {
        alert("Não foi possível criar o chamado. Tente novamente.");
      }
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao criar chamado');
    }
  };

  const esperaChamados = chamados.filter(c => c.status?.toLowerCase() === 'aberto');
  const andamentoChamados = chamados.filter(c => c.status?.toLowerCase() === 'em_andamento');
  const finalizadosChamados = chamados.filter(c => c.status?.toLowerCase() === 'encerrado');

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

  // Spinner simples e estilizado para loading
  const LoadingSpinner = () => (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '20vw', width: '100%'
    }}>
      <div style={{
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #604FEB',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
      }} />
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
      <div className="main-content-wrapper">
        <div className="header">
          <h1>Meus chamados</h1>
          <Botao onClick={() => setOpenModalCalls(true)}>Novo Chamado</Botao>
          <ModalCriarChamado
            isOpen={openModalCalls}
            onClose={() => setOpenModalCalls(false)}
            onSalvar={criarChamadoHandler}
          />
        </div>

        <div className='search-bar'>
          <SearchProvider>
            <SearchBar />
          </SearchProvider>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {[
              { titulo: 'Em Espera', icone: <Clock2 size={16} />, classe: 'espera', lista: esperaChamados },
              { titulo: 'Em Atendimento', icone: <Clock2 size={16} />, classe: 'andamento', lista: andamentoChamados },
              { titulo: 'Encerrado', icone: <Check size={16} />, classe: 'finalizado', lista: finalizadosChamados }
            ].map((secao, idx) => (
              <div className="section" key={idx}>
                <div className={`section-header ${secao.classe}`}>
                  {secao.icone} {secao.titulo}
                </div>
                <div className="chamados-list">
                  {secao.lista.length > 0 ? (
                    secao.lista.map(chamado => (
                      <div
                        key={chamado.id}
                        className={`chamado-card ${secao.classe}`}
                        onClick={() => handleOpenModal(chamado)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-main">
                          <div className="chamado-info">
                            <div className="chamado-codigo">#{chamado.id}</div>
                            <div className="chamado-titulo">{chamado.titulo}</div>
                            <div className="chamado-descricao">{chamado.descricao}</div>
                            <div className="chamado-data">{new Date(chamado.data_criacao).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="user-info">
                            <div className="user-avatar">{user?.nome?.[0] || 'U'}</div>
                            <span className="user-name">{user?.nome || 'Usuário'}</span>
                            <div className={`status-icon ${secao.classe}`}>
                              {secao.icone}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#64748b', paddingLeft: '8px' }}>Nenhum chamado nesta seção.</p>
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
    </div>
  );
};

export default ChamadosCliente;
