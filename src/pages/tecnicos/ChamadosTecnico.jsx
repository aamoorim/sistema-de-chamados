import React, { useState } from 'react';
import { MoreVertical, Check, Clock2, CircleCheckBig } from 'lucide-react';
import './chamados.scss';
import { Aside } from '../../components/aside';

const MeusChamados = () => {
  const chamados = [
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
    }
  ];

  const andamentoChamados = chamados.filter(c => c.status === 'andamento');
  const finalizadosChamados = chamados.filter(c => c.status === 'finalizado');

  // Função para criar o efeito ripple
  const createRipple = (event, button) => {
    // Remove ripples anteriores
    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    // Cria novo ripple
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    // Calcula a posição do clique relativa ao botão
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Posiciona o ripple
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Adiciona ao botão
    button.appendChild(ripple);

    // Remove após a animação
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 800); // Duração da animação suave
  };

  // Handler para o clique no botão encerrar
  const handleEncerrar = (event, chamadoId) => {
    createRipple(event, event.currentTarget);
    
    
  };

  return (
    <div className="app-container">
      <Aside/>
      <div className="main-content">
        <div className="header">
          <h1>Meus chamados</h1>
        </div>

        {/* Seção Em Atendimento */}
        <div className="section">
          <div className="section-header andamento">
            <Clock2 size={16}/> Em atendimento
          </div>
          <div className="chamados-list">
            {andamentoChamados.map(chamado => (
              <div key={chamado.id} className="chamado-card andamento">
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
                      onClick={(e) => handleEncerrar(e, chamado.id)}
                    >
                       <CircleCheckBig size={16}  style={{marginRight: '4px'}}/>Encerrar
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <div className="user-info">
                    <div className="user-avatar">{chamado.avatar}</div>
                    <span className="user-name">{chamado.usuario}</span>
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
              <div key={chamado.id} className="chamado-card finalizado">
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
                    <div className="check-icon"><Check size={14}/></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeusChamados;