// src/layout/AdminLayout.jsx - SOLUÇÃO 1: useLocation
import { Outlet, useLocation } from "react-router-dom";
import { SearchProvider } from "../context/search-context";
import SearchBar from "../components/search-bar";
import SideBar from "../components/SideBar";
import Botao from "../components/Button";
import "../pages/admins/styles.scss";

export default function AdminLayout() {
  const location = useLocation();
  
  // Configuração do botão para cada rota
  const getButtonConfig = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/admin':
        return {
          text: 'Novo Chamado',
        };
      
      case '/admin/clientes':
        return {
          text: 'Novo Cliente',
        };
      
      case '/admin/tecnicos':
        return {
          text: 'Novo Técnico',
        };  
    }
  };
  
  const buttonConfig = getButtonConfig();

  return (
    <div className="calls-admin">
      <SearchProvider>
        <SideBar />
        <main className="calls-admin-main">
          <div className="header-admin">
              <SearchBar />
            <Botao {...buttonConfig} />
            <div className="search-bar-container">
            </div>
          </div>
          <Outlet />
        </main>
      </SearchProvider>
    </div>
  );
}