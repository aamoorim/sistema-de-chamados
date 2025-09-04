// src/layouts/TecnicoLayout.jsx
import { Outlet } from "react-router-dom";
import SearchBar from "../components/search-bar";
import SideBar from "../components/SideBar";
import { SearchProvider } from "../context/search-context";
import "../index.css";

export default function TecnicoLayout() {
  return (
    <div className="calls-admin">
      <SearchProvider>
        <SideBar />
        <main className="calls-admin-main">
          <SearchBar />
          <Outlet /> {/* aqui aparece ChamadosTecnico */}
        </main>
      </SearchProvider>
    </div>
  );
}
