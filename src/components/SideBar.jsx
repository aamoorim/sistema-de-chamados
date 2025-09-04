import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Users, UserCheck, Headphones, MessageSquare, BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import '../index.css';

const SideBar = () => {
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
          { path: '/admin/tecnicos', icon: <BriefcaseBusiness size={20} />, label: 'Técnicos' },
          { path: '/admin/clientes', icon: <Users size={20} />, label: 'Clientes' },
        ];
      case 'cliente':
        return [
          { path: '/cliente', icon: <MessageSquare size={20} />, label: 'Chamados' }
        ];
      case 'tecnico':
        return [
          { path: '/tecnico', icon: <MessageSquare size={20} />, label: 'Chamados', end: true },
          { path: '/tecnico/espera', icon: <Headphones size={20} />, label: 'Em Espera' }
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

export default SideBar;
