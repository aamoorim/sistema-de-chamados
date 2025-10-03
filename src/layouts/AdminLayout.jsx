import { Outlet, useLocation } from "react-router-dom";
import { SearchProvider } from "../context/search-context";
import SearchBar from "../components/search-bar";
import SideBar from "../components/SideBar";
import Botao from "../components/Button";
import "../pages/admins/styles.scss";
import { ModalCriarTecnico } from "../components/Modals/CriarTecnico";
import { useState } from "react";
import { ModalCriarCliente } from "../components/Modals/CriarCliente";
import { useClientes } from "../context/ClientesContext";

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
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

export default function AdminLayout() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const { loading, fetchClientes, setLoading } = useClientes();

  // Função chamada pelo modal após criação do cliente
  const handleClienteCriado = async () => {
    try {
      await fetchClientes();
    } catch (err) {
      console.error("Erro ao atualizar clientes:", err);
    } finally {
      setLoading(false); // desativa loading global depois da atualização
    }
  };

  const getButtonConfig = () => {
    const path = location.pathname;

    switch (path) {
      case "/admin/tecnicos":
        return {
          text: "Novo Técnico",
          modal: (
            <ModalCriarTecnico isOpen={open} onClose={() => setOpen(false)} />
          ),
        };
      case "/admin/clientes":
        return {
          text: "Novo Cliente",
          modal: (
            <ModalCriarCliente
              isOpen={open}
              onClose={() => setOpen(false)}
              onCreateSuccess={handleClienteCriado}
              setLoadingGlobal={setLoading}
            />
          ),
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
              <Botao text={config.text} onClick={() => setOpen(true)} />
            )}
          </div>
          <Outlet />
          {open && config?.modal}
          {loading && <LoadingSpinner />}
        </main>
      </SearchProvider>
    </div>
  );
}
