import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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



const SideBar = () => {
  const [open, setOpen] = useState(false); // modal sair
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // dropdown usuário
  const [sidebarOpen, setSidebarOpen] = useState(false); // controle da sidebar mobile
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openProfileModal } = useModal();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
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
  
  const closeSidebar = () => {
    setSidebarOpen(false);
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
      {/* Botão de menu (hambúrguer) visível apenas no mobile */}
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <aside className={`aside ${sidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <img src="/squad_favicon.svg" alt="Squad BI Logo" />
          <div className="name_user">
            <span className="aside_company">SquadBi</span>
            <span className="aside_user">
              {(user?.role || 'Visitante').toUpperCase()}
            </span>
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
                  onClick={closeSidebar} // fecha sidebar ao clicar em item
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
          
          {/* Menu dropdown */}
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

          {/* Botão clicável para abrir o menu do usuário */}
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
