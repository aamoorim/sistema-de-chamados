// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/routes";
import { AuthProvider } from "./context/auth-context";

<<<<<<< HEAD
function App() {

=======
export default function App() {
>>>>>>> 65dd9b3 (adicionado função de rotas e permissões entre usuários)
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App
