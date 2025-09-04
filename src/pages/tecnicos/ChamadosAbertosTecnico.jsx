import { Outlet } from 'react-router-dom';
import './chamados.scss';
import StyledTable from '../../components/listTableTec'; 

export default function TecEmAndamento() {
  return (
    <div className="app-container">
      <div className="main-content">
        <h1>Chamados - Técnico</h1>
        <StyledTable />     
        {/* Aqui entram os filhos da rota */}
        <Outlet />
      </div>
    </div>
  );
}
