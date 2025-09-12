import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Users, UserCheck, Headphones, MessageSquare, BriefcaseBusiness, User, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { useModal } from '../context/modal-context';
import '../index.css';

const SideBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openProfileModal } = useModal(); //hook para controlar o modal de perfil
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleProfileClick = () => {
    // Navegar para página de perfil ou abrir modal de perfil
    openProfileModal();
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    // Navegar para página de configurações
    navigate('/settings');
    setIsUserMenuOpen(false);
  };

  const handleLogoutFromMenu = () => {
    setIsUserMenuOpen(false);
    handleLogout();
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

      {/* Container do footer com dropdown */}
      <div className="aside_footer" style={{ position: 'relative'}}>
        {/* Menu dropdown */}
        {isUserMenuOpen && (
          <div className="user_dropdown_menu">
            <button className="dropdown_item" onClick={handleProfileClick}>
              <User size={16} />
              <span>Perfil</span>
            </button>
            <div className="dropdown_divider"></div>
            <button className="dropdown_item logout_item" onClick={handleLogoutFromMenu}>
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        )}

        {/* Botão do usuário - agora clicável para abrir dropdown */}
        <button className="aside_footer" onClick={toggleUserMenu}>
          <div className="avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div className="user_info">
            <p>{user?.name || 'Admin Teste'}</p>
            <p>{user?.email || 'admin@email.com'}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;