import { Outlet } from "react-router-dom";
import { Aside } from "../../components/aside";
import './styles.scss';

function CallAdmin() {
  return (
    <div className="calls-admin">
      <Aside />
      <div className="calls-admin-main">  
      <Outlet />  
      </div>
    </div>
  );
}

export default CallAdmin;
