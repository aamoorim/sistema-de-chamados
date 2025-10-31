import { Outlet } from "react-router";
import TecnicosTable from "../../components/TableAdminTec";
import './styles.scss';
export default function TecnicosAdmin() {
    return (
        <>

                <h1 className="header-tecnicos-admin">Técnicos</h1>
                <TecnicosTable />
                <Outlet />

        </>
    )
}