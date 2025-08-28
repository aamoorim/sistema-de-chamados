import { ClipboardList } from 'lucide-react';


export function aside() {
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
                        <span>Técnicos</span>
                    </button>
                    <button className='nav-button'>
                        <ClipboardList size={24} />
                        <span>Clientes</span>
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
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Users, UserCheck, Headphones, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import '../index.css';

export const Aside = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin', icon: <MessageSquare size={20} />, label: 'Chamados', end: true },
          { path: '/admin/clientes', icon: <Users size={20} />, label: 'Clientes' },
          { path: '/admin/tecnicos', icon: <UserCheck size={20} />, label: 'Técnicos' }
        ];
      case 'cliente':
        return [
          { path: '/cliente', icon: <MessageSquare size={20} />, label: 'Chamados' }
        ];
      case 'tecnico':
        return [
          { path: '/tecnico', icon: <MessageSquare size={20} />, label: 'Chamados', end: true },
          { path: '/tecnico/andamento', icon: <Headphones size={20} />, label: 'Em Andamento' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="aside">
      <div className="logo">
        <img src="/logo_squad.svg" alt="Squad BI Logo" />
        <div className="name_user">
          <span className="aside_company">SquadBi</span>
          <span className="aside_user">{user?.role || 'Visitante'}</span>
        </div>
      </div>

      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `nav-button ${isActive ? 'active' : ''}`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button className="aside_footer" onClick={handleLogout}>
        <div className="avatar">
          <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
        </div>
        <div className="user_info">
          <p>{user?.name || 'Admin Teste'}</p>
          <p>{user?.email || 'admin@email.com'}</p>
        </div>
        <LogOut size={16} style={{ marginLeft: 'auto' }} />
      </button>
    </aside>
  );
};

