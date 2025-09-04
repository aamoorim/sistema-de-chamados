import React from 'react';
import { Check, Clock2, CircleCheckBig } from 'lucide-react';
import './chamados.scss';

export default function ChamadosTecnico() {
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

  const handleEncerrar = (event, chamadoId) => {
    console.log(`Encerrando chamado ${chamadoId}`);
  };

  return (
    <div className="tecnico-chamados">
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
                    <CircleCheckBig size={15} style={{marginRight: '4px'}}/>
                    Encerrar
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
  );
}
