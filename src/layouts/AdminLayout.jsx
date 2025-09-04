// src/layout/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { SearchProvider } from "../context/search-context";
import SearchBar from "../components/search-bar"
import SideBar from "../components/SideBar";

export default function AdminLayout() {
  return (
      <div className="calls-admin">
        <SearchProvider>
      <SideBar/>
      <main className="calls-admin-main">
            <SearchBar />
        <Outlet /> {/* aqui mudam só os filhos */}
      </main>
        </SearchProvider>
    </div>
  );
}
