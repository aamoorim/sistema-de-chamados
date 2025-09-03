import { Outlet } from "react-router-dom";
import './styles.scss';
import ListTable from "../../components/listTable";

function CallAdmin() {
  return (
    <div className="calls-admin">
      <ListTable />
      <div className="">
      <Outlet />  
      </div>
    </div>
  );
}

export default CallAdmin;
