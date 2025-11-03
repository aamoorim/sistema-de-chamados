import { useState } from "react";
import { Outlet } from "react-router";
import Botao from "../../components/Button";
import { Plus } from "lucide-react";
import { ModalCriarCliente } from "../../components/Modals/CriarCliente";
import ClientTable from "../../components/ClientAdminTabe";
import SearchBar from "../../components/search-bar";
import './styles.scss';

export default function ClientesAdmin() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="header-container">
        {/* Título dinâmico da página vem do AdminLayout*/}        
        <Botao
            className="botao-novo-cliente"
            icon={Plus}
            text="Novo Cliente"
            onClick={() => setOpen(true)}
          />
      </div>
      <SearchBar/>

      <ClientTable />
      <Outlet />

      <ModalCriarCliente isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
