// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/routes";
import { AuthProvider } from "./context/auth-context";




export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
