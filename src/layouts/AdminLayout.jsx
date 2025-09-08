import { Outlet, useLocation } from "react-router-dom";
import { SearchProvider } from "../context/search-context";
import SearchBar from "../components/search-bar";
import SideBar from "../components/SideBar";
import Botao from "../components/Button";
import "../pages/admins/styles.scss";
import { ModalCriarTecnico } from "../components/Modals/CriarTecnico";
import { useState } from "react";
import { ModalCriarCiente } from "../components/Modals/CriarCliente";
export default function AdminLayout() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  // Configuração do botão para cada rota
  const getButtonConfig = () => {
    const path = location.pathname;
    
    switch (path) {      
      case '/admin/tecnicos':
        return {
          text: 'Novo Técnico',
          modal: <ModalCriarTecnico  isOpen={open} onClose={() => setOpen(false)}/>, // provisório
        }; 
        case '/admin/clientes':
        return {
          text: 'Novo Cliente',
          modal: <ModalCriarCiente isOpen={open} onClose={() => setOpen(false)}/>, // provisório
        };
      
      default:
        return null;
    }
  };
  
  const config = getButtonConfig();

  return (
    <div className="calls-admin">
      <SearchProvider>
        <SideBar />
        <main className="calls-admin-main">
          <div className="header-admin">
            <SearchBar />
            {config && (
              <Botao 
                text={config.text}
                onClick={() => setOpen(true)}
              />
            )}
          </div>
          <Outlet />
          {open && config?.modal}
        </main>
      </SearchProvider>
    </div>
  );
}