import { Outlet } from "react-router";
import ClientTable from "../../components/ClientAdminTabe";

export default function ClientesAdmin() {
    return (
        <>
                <h1>Clientes</h1>
            <div className="calls-admin">
                <ClientTable />
            </div>
            <Outlet />

        </>
    )
}