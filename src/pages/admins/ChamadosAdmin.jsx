import { Aside } from "../../components/aside";
import ListTable from "../../components/listTable";
import SearchBar from "../../components/search-bar";
import { SearchProvider } from "../../context/search-context";
import './styles.scss';

export function CallAdmin() {
  return (
    <div className="calls-admin">
      <Aside />
      <div className="calls-admin-main">
        <h1>Chamados</h1>
        <SearchProvider>
          <SearchBar />
          <ListTable />
        </SearchProvider>
      </div>
    </div>
  );
}
