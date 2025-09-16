// src/layouts/TecnicoLayout.jsx
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import "../index.scss";

export default function TecnicoLayout() {
  return (
    <div className="calls-admin">
      
        <SideBar />
        <main className="calls-admin-main">
          
          <Outlet /> {/* aqui aparece ChamadosTecnico */}
        </main>
      
    </div>
  );
}
