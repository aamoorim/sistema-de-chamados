
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
                    <SearchProvider>
                    <SearchBar />
                    <ListTable />
                </SearchProvider>
                </div>
            </div>
        </>
    )
}
