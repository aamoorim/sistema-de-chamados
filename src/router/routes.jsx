
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import RequireRole from "../router/RequireRole";

// Admin
import AdminLayout from "../pages/admins/ChamadosAdmin";
import AdminClientes from "../pages/admins/ClientesAdmin";
import AdminTec from "../pages/admins/TecnicosAdmin";

// Clientes
import ClienteMeusChamados from "../pages/clientes/ChamadosCliente";

// Tecnicos
import TecEmEspera from "../pages/tecnicos/ChamadosAbertosTecnico";
import TecEmAndamento from "../pages/tecnicos/ChamadosTecnico";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route element={<RequireRole allowed={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminClientes />} />
          <Route path="usuarios" element={<AdminTec />} />
        </Route>
      </Route>

      {/* CLIENTE */}
      <Route element={<RequireRole allowed={["cliente"]} />}>
        <Route path="/cliente" element={<ClienteMeusChamados />}>
        </Route>
      </Route>

      {/* TÉCNICO */}
      <Route element={<RequireRole allowed={["tecnico"]} />}>
        <Route path="/tecnico" element={<TecEmEspera />}>
          <Route path="andamento" element={<TecEmAndamento />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
