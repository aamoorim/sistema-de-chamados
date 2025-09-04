
import Botao from "../../components/Button";
import ListTable from "../../components/listTable";
import SearchBar from "../../components/search-bar";
import SideBar from "../../components/SideBar";
import { SearchProvider } from "../../context/search-context";
import './styles.scss';


export default function ChamadosCliente() {
    return (
        <>
            <div className="calls-client">
            <SideBar />
                <div className="calls-client-main">
        <h1>Meus Chamados</h1>
                    <SearchProvider>
                    <div className="header-admin">
                        <SearchBar />
                        <Botao>Novo Chamado</Botao>
                    </div>

                </SearchProvider>
                </div>
            </div>
        </>
    )
}
