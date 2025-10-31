import { Outlet } from "react-router-dom";
import { SearchProvider } from "../context/search-context";
import SideBar from "../components/SideBar";
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
  const { loading } = useClientes();

  return (
    <div>
      <SearchProvider>
        <SideBar />
        <main>
          <Outlet />
          {loading && <LoadingSpinner />}
        </main>
      </SearchProvider>
    </div>
  );
}