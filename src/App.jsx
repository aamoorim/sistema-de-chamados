// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes";
import { AuthProvider } from "./context/auth-context";  
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
