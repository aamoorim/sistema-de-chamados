import React from "react";
import AppRoutes from "./router/routes.jsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme";
import { ModalProvider } from "./context/modal-context.jsx";
import ProfileModal from './components/Modals/Perfil';
import { ClientesProvider } from "./context/ClientesContext";
import { TecnicosProvider } from "./context/TecnicosContext";
import { SearchProvider } from "./context/search-context";
import { ChamadosAbertosTecnicosProvider } from "./context/ChamadosAbertosTecnicosContext";

export default function App() {
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
