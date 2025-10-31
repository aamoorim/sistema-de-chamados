import { Outlet } from "react-router";
import ClientTable from "../../components/ClientAdminTabe";

export default function ClientesAdmin() {
    return (
        <>
                <h1 className="header-clientes-admin">Clientes</h1>
                <ClientTable />
                <Outlet />

        </>
    )
}