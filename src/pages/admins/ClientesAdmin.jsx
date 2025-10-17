import { Outlet } from "react-router";
import ClientTable from "../../components/ClientAdminTabe";

export default function ClientesAdmin() {
    return (
        <>
                <h1>Clientes</h1>
            <div className="tabela-admin-container">
                <ClientTable />
            </div>
            <Outlet />

        </>
    )
}