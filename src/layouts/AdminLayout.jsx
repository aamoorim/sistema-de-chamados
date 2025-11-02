import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // Importando useLocation
import { SearchProvider } from "../context/search-context";
import SideBar from "../components/SideBar";
import { useClientes } from "../context/ClientesContext";
import useIsMobile from "../hooks/useIsMobile";

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

export default function AdminLayout() {
  const { loading } = useClientes();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hook para pegar a rota atual
  const location = useLocation();

  // Função para definir o título com base na rota atual
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin":
        return "Chamados"; // Página de Chamados
      case "/admin/clientes":
        return "Clientes"; // Página de Clientes
      case "/admin/tecnicos":
        return "Técnicos"; // Página de Técnicos
      default:
        return "Administração"; // Página padrão
    }
  };

  // Função para alternar o estado da sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <SearchProvider>
        <div className="layout-container">
          <header className="header-admin">
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
