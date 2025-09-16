import React, { useState } from 'react';
import { Check, Clock2, CircleCheckBig, Pointer, Pencil } from 'lucide-react';
import SideBar from '../../components/SideBar';
import '../clientes/clientes.scss';
import Botao from "../../components/Button"
import { ModalCriarChamado } from '../../components/Modals/CriarChamado';
import ModalChamadoDetalhes from '../../components/Modals/DetalhesChamados';
import { SearchProvider } from '../../context/search-context';
import SearchBar from "../../components/search-bar"
import EditTicketModal from '../../components/Modals/EditarChamado';

const ChamadosCliente = () => {
  const [chamados] = useState([
    {
      id: 1,
      codigo: '00001',
      tipo: 'Rede lenta',
      descricao: 'Instabilidade de Rede',
      data: '10/04/25 15:13',
      usuario: 'André Costa',
      avatar: 'AC',
      status: 'andamento',
      hasButton: true,
    },
    {
      id: 2,
      codigo: '00002',
      tipo: 'Computador não liga',
      descricao: 'Problema na fonte de alimentação',
      data: '20/06/25 19:13',
      usuario: 'Carla Silva',
      avatar: 'CS',
      status: 'finalizado',
      hasButton: false,
    },
    {
      id: 3,
      codigo: '00003',
      tipo: 'Internet instável',
      descricao: 'Problema de conectividade',
      data: '08/09/25 14:30',
      usuario: 'João Santos',
      avatar: 'JS',
      status: 'espera',
      hasButton: true,
    },
    {
      id: 4,
      codigo: '00004',
      tipo: 'Sistema lento',
      descricao: 'Performance do sistema',
      data: '08/09/25 16:45',
      usuario: 'Maria Oliveira',
      avatar: 'MO',
      status: 'andamento',
      hasButton: true,
    },
    {
      id: 5,
      codigo: '00005',
      tipo: 'Email não funciona',
      descricao: 'Problema de configuração',
      data: '07/09/25 10:20',
      usuario: 'Pedro Lima',
      avatar: 'PL',
      status: 'finalizado',
      hasButton: false,
    },
    {
      id: 6,
      codigo: '00006',
      tipo: 'Impressora offline',
      descricao: 'Hardware',
      data: '08/09/25 11:15',
      usuario: 'Ana Torres',
      avatar: 'AT',
      status: 'espera',
      hasButton: true,
    },
    {
      id: 7,
      codigo: '00007',
      tipo: 'Monitor sem sinal',
      descricao: 'Tela não exibe imagem',
      data: '08/09/25 18:45',
      usuario: 'Fernanda Silva',
      avatar: 'FS',
      status: 'andamento',
      hasButton: true,
    },
    {
      id: 8,
      codigo: '00008',
      tipo: 'Monitor sem sinal',
      descricao: 'Tela não exibe imagem',
      data: '08/09/25 18:45',
      usuario: 'Fernanda Silva',
      avatar: 'FS',
      status: 'espera',
      hasButton: true,
    },
    {
      id: 9,
      codigo: '00009',
      tipo: 'Backup não funciona',
      descricao: 'Sistema de backup apresenta erro',
      data: '07/09/25 16:30',
      usuario: 'Roberto Costa',
      avatar: 'RC',
      status: 'finalizado',
      hasButton: false,
    }
  ]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // opcional: passar dados para o modal

  const esperaChamados = chamados.filter(c => c.status === 'espera');
  const andamentoChamados = chamados.filter(c => c.status === 'andamento');
  const finalizadosChamados = chamados.filter(c => c.status === 'finalizado');

  const handleEncerrar = (event, chamadoId) => {
    const button = event.currentTarget;

    // cria o span ripple
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    // calcula posição do clique
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    // adiciona ao botão
    button.appendChild(ripple);

    // remove depois da animação
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  const handleOpenEdit = (row) => {
    setSelectedTicket(row); // opcional: enviar dados do ticket
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedTicket(null);
    setOpenEditModal(false);
  };

const [openModalCalls, setOpenModalCalls] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [openModalDetails, setOpenModalDetails] = useState(false)
  const handleOpenModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setOpenModalDetails(true);
  }

  return (
    <div className="tecnico-chamados">
      {/* Conteúdo principal */}
      <div className="main-content-wrapper">
          
        <div className="header">
          <h1>Meus chamados</h1>
          <Botao onClick={() => setOpenModalCalls(true)}>Novo Chamado</Botao>
          <ModalCriarChamado isOpen={openModalCalls} onClose={() => setOpenModalCalls(false)}/>
        </div>
        <div className='search-bar'>
            <SearchProvider>
            <SearchBar  />
          </SearchProvider>
          </div>
        
        {/* Seção Em Espera */}
        <div className="section">
          <div className="section-header espera">
            <Clock2 size={16}/> Em espera
          </div>
          <div className="chamados-list">
            {esperaChamados.map(chamado => (
              <div key={chamado.id} className="chamado-card espera" onClick={() => handleOpenModal(chamado)} style={{ cursor: "pointer" }}>
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data}</div>
                  </div>  
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar}</div>
                    <span className="user-name">{chamado.usuario}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Clock2 size={16}/>
                    </div>
                  </div>
                </div>  
              </div>
            ))}
          </div>
        </div>

        {/* Seção Em Atendimento */}
        <div className="section">
          <div className="section-header andamento">
            <Clock2 size={16}/> Em atendimento
          </div>
          <div className="chamados-list">
            {andamentoChamados.map(chamado => (
              <div key={chamado.id} className="chamado-card andamento" onClick={() => handleOpenModal(chamado)} style={{ cursor: "pointer" }}>
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data}</div>
                  </div>
                  {chamado.hasButton && (
                    <button 
                      className="btn-encerrar"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEncerrar(e, chamado.id)
                      }}
                    >
                      <Pencil size={13} style={{marginRight: '4px'}} onClick={() => handleOpenEdit(row)}/>
                      Editar
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar}</div>
                    <span className="user-name">{chamado.usuario}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Clock2 size={16}/>
                    </div>
                  </div>
                </div>  
              </div>
            ))}
          </div>
        </div>

        {/* Seção Encerrados */}
        <div className="section">
          <div className="section-header finalizado">
            <Check size={16}/> Encerrado
          </div>
          <div className="chamados-list">
            {finalizadosChamados.map(chamado => (
              <div key={chamado.id} className="chamado-card finalizado" onClick={() => handleOpenModal(chamado)} style={{cursor: "pointer"}}>
                <div className="card-main">
                  <div className="chamado-info">
                    <div className="chamado-codigo">{chamado.codigo}</div>
                    <div className="chamado-titulo">{chamado.tipo}</div>
                    <div className="chamado-descricao">{chamado.descricao}</div>
                    <div className="chamado-data">{chamado.data}</div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar}</div>
                    <span className="user-name">{chamado.usuario}</span>
                    <div className={`status-icon ${chamado.status}`}>
                      <Check size={16}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> 
        </div>  
      </div>

      {/* Sidebar posicionada à direita */}
      <div className="sidebar-container">
        <SideBar />
      </div>
      <ModalChamadoDetalhes  isOpen={openModalDetails} onClose={() => setOpenModalDetails(false)} chamado={chamadoSelecionado}/>


        {/* Modal de editar chamado */}
              {openEditModal && (
                <EditTicketModal
                  open={openEditModal}
                  onClose={handleCloseEdit}
                  ticket={selectedTicket} // opcional, caso queira passar os dados do ticket
                />
              )}
    </div>
  );
};

export default ChamadosCliente;