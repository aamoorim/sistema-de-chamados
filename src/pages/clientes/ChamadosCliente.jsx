import { Aside } from "../../components/aside";
import ListTable from "../../components/listTable";
import SearchBar from "../../components/search-bar";
import { SearchProvider } from "../../context/search-context";
import './styles.scss';

export default function ChamadosCliente() {
    return (
        <>
            <div className="calls-client">
            <Aside />
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
