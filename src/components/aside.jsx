import { ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { getNavigationByRole } from '../config/navigation-config';
import { Link, useLocation } from 'react-router-dom';

export function Aside() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  
  // Pega os itens de navegação baseado no role do usuário
  const navigationItems = getNavigationByRole(role);
  
  // Função para verificar se a rota está ativa
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Função para definir o nome do usuário baseado no role
  const getUserDisplayInfo = () => {
    const roleNames = {
      admin: 'Administrador',
      cliente: 'Cliente',
      tecnico: 'Técnico'
    };
    
    return {
      roleName: roleNames[role] || 'Usuário',
      userName: user?.nome || user?.name || 'Usuário',
      userEmail: user?.email || `${role}@email.com`
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className="app-container">
      <aside className="aside">
        {/* Logo e informações do usuário */}
        <div className="logo">
          <img src="/logo_squad.svg" alt="logo da empresa squadBi" />
          <div className="name_user">
            <span className="aside_company">SquadBi</span>
            <span className="aside_user">{userInfo.roleName}</span>
          </div>
        </div>

        {/* Navegação dinâmica baseada no role */}
        <nav>
          <ul>
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <li key={index}>
                  <Link 
                    to={item.path}
                    className={`nav-button ${isActive ? 'active' : ''}`}
                  >
                    <IconComponent size={24} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer com informações do usuário e logout */}
        <div className="aside_footer_container">
          <button className="aside_footer">
            <div className="avatar">
              {userInfo.userName.charAt(0).toUpperCase()}
              {userInfo.roleName.charAt(0).toUpperCase()}
            </div>
            <div className="user_info">
              <p>{userInfo.userName}</p>
              <p>{userInfo.userEmail}</p>
            </div>
          </button>
          
          <button className="logout-button" onClick={logout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </div>
  );
}