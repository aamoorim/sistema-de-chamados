import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LogOut,
  Users,
  Headphones,
  MessageSquare,
  BriefcaseBusiness,
  User,
} from 'lucide-react';

import { useAuth } from '../context/auth-context';
import { useModal } from '../context/modal-context';
import { ModalSairPerfil } from './Modals/Sair';
import '../styles/SideBar/sidebar.scss';

const SideBar = ({ sidebarOpen, closeSidebar }) => {
  const [open, setOpen] = useState(false); // Modal sair
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Dropdown usuário
  const { user, logout } = useAuth();
  const { openProfileModal } = useModal();

  const handleLogout = () => {
    logout();
    // Redirect to login page or any other page
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleProfileClick = () => {
    openProfileModal();
    setIsUserMenuOpen(false);
  };

  const handleLogoutFromMenu = () => {
    setIsUserMenuOpen(false);
    handleLogout();
  };

  // Função getMenuItems para retornar os itens de menu com base no papel do usuário
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

  // Menu items agora é gerado com a função getMenuItems
  const menuItems = getMenuItems();

  // Impede o scroll da página quando a sidebar estiver aberta
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Sidebar */}
      <aside className={`aside ${sidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <img src="/squad_favicon.svg" alt="Squad BI Logo" />
          <div className="name_user">
            <span className="aside_company">SquadBi</span>
            <span className="aside_user">{(user?.role || 'Visitante').toUpperCase()}</span>
          </div>
        </div>

        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                  onClick={closeSidebar} // Fecha a sidebar ao clicar no item
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer com dropdown */}
        <div className="aside_footer" style={{ position: 'relative' }}>
          {isUserMenuOpen && (
            <div className="user_dropdown_menu">
              <button className="dropdown_item" onClick={handleProfileClick}>
                <User size={16} />
                <span>Perfil</span>
              </button>
              <div className="dropdown_divider"></div>
              <button className="dropdown_item logout_item" onClick={() => setOpen(true)}>
                <LogOut size={16} />
                <span>Sair</span>
              </button>
              <ModalSairPerfil isOpen={open} onClose={() => setOpen(false)} />
            </div>
          )}

          <button className="aside_footer" onClick={toggleUserMenu}>
            <div className="avatar">
              <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
            <div className="user_info">
              <p>{user?.name || 'Usuário desconhecido'}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
