import { Outlet } from "react-router-dom";
import './styles.scss';
import ListTable from "../../components/listTable";

function CallAdmin() {
  return (
      <>
      
      <h1>Chamados</h1>
    <div className="calls-admin">
      <ListTable />
      <div className="">
      <Outlet />  
      </div>
    </div>
      
      </>
  );
}

export default CallAdmin;
