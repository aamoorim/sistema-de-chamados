// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes.jsx";
import { AuthProvider } from "./context/auth-context";
import { theme } from "./config/theme";
import { ThemeProvider } from "@mui/material";
import { ModalProvider } from "./context/modal-context.jsx";
import ProfileModal from './components/Modals/Perfil'; // ✅ SEM CHAVES

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ModalProvider>
          <ProfileModal />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
