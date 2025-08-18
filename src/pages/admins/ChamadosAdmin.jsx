import { Aside } from "../../components/aside";
import ListTable from "../../components/listTable";
import './styles.scss';
export function CallAdmin() {
    return (
        <>
            <div className="calls-admin">
                <Aside />
                <div className="calls-admin-main">
                    <h1>Chamados</h1>
                    <ListTable />
                </div>
            </div>
        </>
    )
}