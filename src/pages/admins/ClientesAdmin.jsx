import { Outlet } from "react-router";
import ListTable from "../../components/listTable";

export default function ClientesAdmin() {
    return (
        <>
            <div>Clientes Admin</div>
            <ListTable />
            <Outlet />

        </>
    )
}