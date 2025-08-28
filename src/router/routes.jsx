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
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route element={<RequireRole allowed={["admin"]} />}>
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

      {/* CLIENTE */}
      <Route element={<RequireRole allowed={["cliente"]} />}>
        <Route path="/cliente" element={<ClienteMeusChamados />}>
          <Route index element={<ClienteMeusChamados />} />
        </Route>
      </Route>

      {/* TÉCNICO */}
      <Route element={<RequireRole allowed={["tecnico"]} />}>
        <Route path="/tecnico" element={<TecEmAndamento />}>
        <Route index element={<MeusChamados /> } />
        <Route path="andamento" element={<TecEmEspera />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}