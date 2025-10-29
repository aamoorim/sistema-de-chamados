import { Outlet } from "react-router-dom";
import './styles.scss';
import ListTable from "../../components/listTable";

function CallAdmin() {
  return (
      <>
      
      <h1 className="header-chamados-admin">Chamados</h1>
      <div >
      <ListTable />
      <div >
      <Outlet />  
      </div>
    </div>
      
      </>
  );
}

export default CallAdmin;
