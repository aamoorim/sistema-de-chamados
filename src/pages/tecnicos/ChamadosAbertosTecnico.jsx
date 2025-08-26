import { Aside } from '../../components/aside';
import { Outlet } from 'react-router-dom';
import './chamados.scss';

export default function TecEmAndamento() {
  return (
    <div className="app-container">
      <Aside />
      <div className="main-content">
        <h1>Chamados - Técnico</h1>
        {/* Aqui entram os filhos da rota */}
        <Outlet />
      </div>
    </div>
  );
}
