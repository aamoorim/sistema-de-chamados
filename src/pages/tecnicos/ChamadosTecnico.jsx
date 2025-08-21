import React, { useState } from 'react';
import { Phone, MoreVertical, Check, Clock2, FileText,} from 'lucide-react';
import './chamados.scss'; // Certifique-se de que o caminho está correto
import { Aside } from '../../components/aside';


const MeusChamados = () => {
  const [activeTab, setActiveTab] = useState('andamento');
  
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
      buttonText: 'Encerrar chamado'
    },
    {
      id: 2,
      codigo: '00002',
      tipo: 'Rede lenta',
      descricao: 'Instabilidade de Rede', 
      data: '10/04/25 15:13',
      usuario: 'Carlos Silva',
      avatar: 'CS',
      status: 'finalizado',
      hasButton: false
    }
  ];

  const filteredChamados = chamados.filter(chamado => {
    if (activeTab === 'andamento') return chamado.status === 'andamento' || chamado.status === 'finalizado';
    return true;
  });

  return (
   <>
     <div className="app-container">
        <Aside />
      <div className="main-content">
        <div className="header">
          <h1>Meus chamados</h1>
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'andamento' ? 'active' : ''}`}
              onClick={() => setActiveTab('andamento')}
            >
              <span className="tab-icon"><Clock2  size={16}/></span>
              Em andamento  
            </button>
          </div>
        </div>

        <div className="chamados-list">
          {filteredChamados.map((chamado) => (
            <div key={chamado.id} className={`chamado-card ${chamado.status}`}>
              <div className="card-header">
                <div className="chamado-info">
                  <div className="chamado-codigo">{chamado.codigo}</div>
                  <div className="chamado-titulo">{chamado.tipo}</div>
                  <div className="chamado-descricao">{chamado.descricao}</div>
                </div>
                <div className="card-actions">
                  {chamado.hasButton && (
                    <button className="btn-enviar">
                      {chamado.buttonText}
                    </button>
                  )}
                  <button className="more-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="chamado-data">{chamado.data}</div>
                <div className="user-info">
                  <div className="user-avatar">{chamado.avatar}</div>
                  <span className="user-name">{chamado.usuario}</span>
                  {chamado.status === 'finalizado' && (
                    <Check className="status-icon finalizado" size={16} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
   </>
    
  );
  
};

export default MeusChamados;