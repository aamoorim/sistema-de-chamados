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
import { SearchProvider } from "../context/search-context";
import SearchBar from "../components/search-bar";
import ListTable from "../components/listTable";
import MeusChamados from "../pages/tecnicos/ChamadosTecnico";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* ADMIN */}
      <Route element={<RequireRole allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<CallAdmin />}>
          <Route index element={
            <SearchProvider>
              <SearchBar />
              <ListTable />
            </SearchProvider>
          } />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="tecnicos" element={<TecnicosAdmin />} />
        </Route>
      </Route>

      {/* CLIENTE - CORRIGIDO: allowedRoles em vez de allowed */}
      <Route element={<RequireRole allowedRoles={["cliente"]} />}>
        <Route path="/cliente" element={<ClienteMeusChamados />}>
          <Route index element={<ClienteMeusChamados />} />
        </Route>
      </Route>

      {/* TÉCNICO - CORRIGIDO: allowedRoles em vez de allowed */}
      <Route element={<RequireRole allowedRoles={["tecnico"]} />}>
        <Route path="/tecnico" element={<TecEmAndamento />}>
          <Route index element={<MeusChamados />} />
          <Route path="andamento" element={<TecEmEspera />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}