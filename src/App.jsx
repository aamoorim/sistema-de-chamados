import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes.jsx";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme";
import { ModalProvider } from "./context/modal-context.jsx";
import ProfileModal from './components/Modals/Perfil'; 
import { ClientesProvider } from "./context/ClientesContext";
import { TecnicosProvider } from "./context/TecnicosContext";
import { SearchProvider } from "./context/search-context";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ClientesProvider>
          <TecnicosProvider>
            <SearchProvider>
              <ModalProvider>
                <ProfileModal />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </ModalProvider>
            </SearchProvider>
          </TecnicosProvider>
        </ClientesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
