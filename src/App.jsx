import AppRoutes from "./router/routes.jsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme";
import { ModalProvider } from "./context/modal-context.jsx";
import ProfileModal from './components/Modals/Perfil'; 
import { ClientesProvider } from "./context/ClientesContext";
import { TecnicosProvider } from "./context/TecnicosContext";
import { SearchProvider } from "./context/search-context";
import { ChamadosAbertosTecnicosProvider } from "./context/ChamadosAbertosTecnicosContext"; 
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context/auth-context";

export default function App() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
          navigate('/login');
        }
      } catch (e) {
        logout();
        navigate('/login');
      }
    }
  }, [logout, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <ClientesProvider>
        <TecnicosProvider>
          <SearchProvider>
            <ChamadosAbertosTecnicosProvider> 
              <ModalProvider>
                <ProfileModal />
                <AppRoutes />
              </ModalProvider>
            </ChamadosAbertosTecnicosProvider>
          </SearchProvider>
        </TecnicosProvider>
      </ClientesProvider>
    </ThemeProvider>
  );
}
