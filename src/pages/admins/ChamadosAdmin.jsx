import { Outlet } from "react-router";
import { Aside } from "../../components/aside";
import ListTable from "../../components/listTable";
import SearchBar from "../../components/search-bar";
import { SearchProvider } from "../../context/search-context";
import './styles.scss';

export default function CallAdmin() {
  return (
    <div className="calls-admin">
      <Aside />
      <div className="calls-admin-main">  
      <Outlet />  
      </div>
    </div>
  );
}
