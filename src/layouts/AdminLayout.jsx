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
      case '/admin/clientes':
        return {
          text: 'Novo Cliente',
          modal: <div>Modal Cliente</div>, // provisório
        };
      
      case '/admin/tecnicos':
        return {
          text: 'Novo Técnico',
          modal: <div>Modal Técnico</div>, // provisório
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
              />
            )}
          </div>
          <Outlet />
        </main>
      </SearchProvider>
    </div>
  );
}