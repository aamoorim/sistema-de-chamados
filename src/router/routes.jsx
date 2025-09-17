import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import RequireRole from "../router/RequireRole";

// Admin
// Clientes
import ClienteMeusChamados from "../pages/clientes/ChamadosCliente";
// Tecnicos
import TecEmEspera from "../pages/tecnicos/ChamadosAbertosTecnico";
import TecEmAndamento from "../pages/tecnicos/ChamadosTecnico";
import CallAdmin from "../pages/admins/ChamadosAdmin";
import ClientesAdmin from "../pages/admins/ClientesAdmin";
import TecnicosAdmin from "../pages/admins/TecnicosAdmin";
import AdminLayout  from "../layouts/AdminLayout";
import TecnicoLayout from "../layouts/TecnicoLayout";
import ChamadosCliente from "../pages/clientes/ChamadosCliente";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* ADMIN */}
      <Route element={<RequireRole allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CallAdmin />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="tecnicos" element={<TecnicosAdmin />} />
        </Route>
      </Route>

      {/* CLIENTE */}
      <Route element={<RequireRole allowedRoles={["cliente"]} />}>
        <Route path="/cliente" element={<ClienteMeusChamados />}>
          <Route index element={<ClienteMeusChamados />} />
        </Route>
      </Route>

      {/* TÉCNICO */}
      <Route element={<RequireRole allowedRoles={["tecnico"]} />}>
          <Route path="/tecnico" element={<TecnicoLayout />}>
          <Route index element={<TecEmAndamento />} />
          <Route path="espera" element={<TecEmEspera />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}