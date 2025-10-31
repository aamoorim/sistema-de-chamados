import { useState } from "react";
import { Outlet } from "react-router";
import TecnicosTable from "../../components/TableAdminTec";
import Botao from "../../components/Button";
import { Plus } from "lucide-react";
import SearchBar from "../../components/search-bar";
import { ModalCriarTecnico } from "../../components/Modals/CriarTecnico";
import './styles.scss';

export default function TecnicosAdmin() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header-container">
        <h1 className="header-tecnicos-admin">Técnicos</h1>
        <Botao
          className="botao-novo-tecnico"
          icon={Plus}
          text="Novo Técnico"
          onClick={() => setOpen(true)}
        />
      </div>
      <SearchBar/>
      <TecnicosTable />
      <Outlet />

      <ModalCriarTecnico isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
