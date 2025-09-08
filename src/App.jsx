// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes.jsx";
import { AuthProvider } from "./context/auth-context";
import { theme } from "./config/theme";
import { ThemeProvider } from "@mui/material";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
