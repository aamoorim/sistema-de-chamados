import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes.jsx";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "@mui/material";
import { theme } from "./config/theme";

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
