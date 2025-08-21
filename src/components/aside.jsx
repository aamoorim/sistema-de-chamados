import { ClipboardList } from 'lucide-react';


export function Aside() {
    return (
        <div className="app-container">
            <aside className="aside">
            <div className="logo">  
                <img src="/logo_squad.svg" alt="logo da empresa squadBi" />

                <div className="name_user">
                    <span className="aside_company">SquadBi</span>
                    <span className="aside_user">Admin</span>
                </div>
        
            </div>

            

            <nav>
                <ul>
                    <button className='nav-button'>
                        <ClipboardList size={24} />
                        <span>Chamados</span>   
                    </button>
                    <button className='nav-button'>
                        <ClipboardList size={24} />
                        <span>Relatórios</span>
                    </button>
                    <button className='nav-button'>
                        <ClipboardList size={24} />
                        <span>Configurações</span>
                    </button>
                </ul>
            </nav>

            <button className="aside_footer">
                    <div className="avatar">UA</div>
                    <div className="user_info">
                        <p>Usuário Admin</p>
                        <p>admin.test@email.com</p>
                    </div>
            </button>

        </aside>
        </div>
    )
}