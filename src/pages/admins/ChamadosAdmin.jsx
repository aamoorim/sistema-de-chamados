import { Outlet } from "react-router-dom";
import './styles.scss';
import SideBar from "../../components/SideBar";
import ListTable from "../../components/listTable";
import { SearchProvider } from "../../context/search-context";

function CallAdmin() {
  return (
    <div className="calls-admin">
      <div className="calls-admin-table">
      <ListTable />
      <Outlet />  
      </div>
    </div>
  );
}

export default CallAdmin;
