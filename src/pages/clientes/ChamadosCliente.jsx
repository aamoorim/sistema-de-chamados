import { useState } from "react";
import Botao from "../../components/Button";
import ListTable from "../../components/listTable";
import { ModalCriarChamado } from "../../components/Modals/CriarChamado";
import SearchBar from "../../components/search-bar";
import SideBar from "../../components/SideBar";
import { SearchProvider } from "../../context/search-context";
import './styles.scss';


export default function ChamadosCliente() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="calls-client">
            <SideBar />
                <div className="calls-client-main">
            <h1>Meus Chamados</h1>
                <SearchProvider>
                <div className="header-admin">
                    <SearchBar />
                    <Botao onClick={() => setOpen(true)}>Novo Chamado</Botao>
                    <ModalCriarChamado isOpen={open} onClose={() => setOpen(false)} />
                </div>
                <ListTable />
                </SearchProvider>
                </div>
            </div>
        </>
    )
}
