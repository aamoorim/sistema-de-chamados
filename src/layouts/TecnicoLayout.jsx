import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import useIsMobile from "../hooks/useIsMobile";
import { useClientes } from "../context/ClientesContext"; 
import { SearchProvider } from "../context/search-context";
import "../index.scss";

// Spinner simples
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #604FEB",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function TecnicoLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useClientes();
  const location = useLocation(); // Hook para acessar a localização atual

  // Função para definir o título com base na rota atual
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/tecnico":
        return "Meus Chamados"; // Página de Chamados do técnico
      case "/tecnico/espera":
        return "Chamados Abertos"; // Página de chamados abertos
      default:
        return "Página Não Encontrada"; // Caso a rota não seja reconhecida
    }
  };

  // Atualizando o título da página sempre que a rota mudar
  useEffect(() => {
    document.title = getPageTitle(); // Atualiza o título da aba do navegador
  }, [location]); // O efeito é executado sempre que a localização (rota) mudar

  // Função para alternar o estado da sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <SearchProvider>
        <div className="layout-container">
          <header className="header-tecnico">
            <div className="header-title">
              <h1>{getPageTitle()}</h1> {/* Passa o título dinâmico */}
            </div>

            {/* Exibe o botão de menu hamburger apenas no mobile */}
            {isMobile && (
              <button className="menu-toggle" onClick={toggleSidebar}>
                ☰ {/* Ícone do menu */}
              </button>
            )}
          </header>

          {/* Renderize a Sidebar uma vez, com controle de visibilidade */}
          <SideBar
            sidebarOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)} // Passando função para fechar a sidebar
            isMobile={isMobile}
          />

          <main>
            <Outlet />
            {loading && <LoadingSpinner />}
          </main>
        </div>
      </SearchProvider>
    </div>
  );
}
