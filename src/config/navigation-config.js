import { ClipboardList, Users, UserCog, Settings, BarChart3, Plus } from 'lucide-react';

export const NAVIGATION_CONFIG = [
  // ADMIN - Todas as opções
  {
    role: 'admin',
    items: [
      {
        label: 'Chamados',
        icon: ClipboardList,
        path: '/admin',
        subItems: [
          { label: 'Todos Chamados', path: '/admin' },
          { label: 'Relatórios', path: '/admin/relatorios' }
        ]
      },
      {
        label: 'Clientes',
        icon: Users,
        path: '/admin',
        subItems: [
          { label: 'Gerenciar Clientes', path: '/admin' }
        ]
      },
      {
        label: 'Técnicos',
        icon: UserCog,
        path: '/admin/usuarios',
        subItems: [
          { label: 'Gerenciar Técnicos', path: '/admin/usuarios' }
        ]
      },
      {
        label: 'Configurações',
        icon: Settings,
        path: '/admin/config'
      }
    ]
  },
  
  // CLIENTE - Apenas seus chamados
  {
    role: 'cliente',
    items: [
      {
        label: 'Meus Chamados',
        icon: ClipboardList,
        path: '/cliente',
        subItems: [
          { label: 'Ver Chamados', path: '/cliente' },
          { label: 'Histórico', path: '/cliente/historico' }
        ]
      },
      {
        label: 'Criar Chamado',
        icon: Plus,
        path: '/cliente/novo'
      },
      {
        label: 'Meu Perfil',
        icon: Settings,
        path: '/cliente/perfil'
      }
    ]
  },

  // TÉCNICO - Chamados para atender
  {
    role: 'tecnico',
    items: [
      {
        label: 'Em Espera',
        icon: ClipboardList,
        path: '/tecnico',
        subItems: [
          { label: 'Chamados Abertos', path: '/tecnico' }
        ]
      },
      {
        label: 'Em Andamento',
        icon: BarChart3,
        path: '/tecnico/andamento',
        subItems: [
          { label: 'Meus Atendimentos', path: '/tecnico/andamento' }
        ]
      },
    ]
  }
];

// Função para pegar navegação baseada no role
export const getNavigationByRole = (userRole) => {
  const config = NAVIGATION_CONFIG.find(nav => nav.role === userRole);
  return config ? config.items : [];
};
