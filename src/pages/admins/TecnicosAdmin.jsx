import { Outlet } from "react-router";
import TecnicosTable from "../../components/TableAdminTec";
import './styles.scss';
export default function TecnicosAdmin() {
    return (
        <>

                <h1>Técnicos</h1>
            <div className="calls-admin">
                <TecnicosTable />
            </div>
            <Outlet />

        </>
    )
}