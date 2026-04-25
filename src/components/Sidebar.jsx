import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ListTodo, MessageSquare, Calendar,
  FileText, BarChart3, Settings, Building2, FolderArchive,
  ClipboardList, Lightbulb, Award, Shield,
  Crown, Users, Activity, Star, UserPlus, LogOut,
  ChevronDown, ChevronRight, Users2, Megaphone, HeartHandshake,
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════════════════
   DÉFINITION DES GROUPES DE NAVIGATION
   Chaque groupe a une icône principale + sous-items dépliables
══════════════════════════════════════════════════════════════════════════════ */

const ADMIN_GROUPS = [
  {
    id: 'dashboard',
    name: 'Tableau de bord',
    icon: LayoutDashboard,
    path: '/dashboard',          // lien direct (pas de sous-menu)
    single: true,
  },
  {
    id: 'work',
    name: 'Travail',
    icon: ListTodo,
    items: [
      { name: 'Tâches', path: '/tasks', icon: ListTodo },
      { name: 'Archives', path: '/archives', icon: FolderArchive },
    ],
  },
  {
    id: 'hr',
    name: 'Ressources humaines',
    icon: Users2,
    items: [
      { name: 'Congés', path: '/leaves', icon: Calendar },
      { name: 'Chefs de dept.', path: '/manage-chefs', icon: Crown },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: Megaphone,
    items: [
      { name: 'Messages', path: '/messages', icon: MessageSquare },
      { name: 'Actualités', path: '/posts', icon: FileText },
      { name: 'Enquêtes', path: '/surveys', icon: ClipboardList },
      { name: 'Boîte à idées', path: '/feedbacks/admin', icon: Lightbulb },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    single: true,
  },
  {
    id: 'settings',
    name: 'Paramètres',
    icon: Settings,
    path: '/parametre',
    single: true,
  },
];

const EMPLOYEE_GROUPS = [
  {
    id: 'work',
    name: 'Mon travail',
    icon: ListTodo,
    items: [
      { name: 'Mes tâches', path: '/tasks', icon: ListTodo },
      { name: 'Archives', path: '/archives', icon: FolderArchive },
    ],
  },
  {
    id: 'hr',
    name: 'RH & Congés',
    icon: HeartHandshake,
    items: [
      { name: 'Mes congés', path: '/leaves', icon: Calendar },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: Megaphone,
    items: [
      { name: 'Messages', path: '/messages', icon: MessageSquare },
      { name: 'Actualités', path: '/posts', icon: FileText },
      { name: 'Enquêtes', path: '/surveys', icon: ClipboardList },
      { name: 'Boîte à idées', path: '/feedbacks', icon: Lightbulb },
    ],
  },
  {
    id: 'settings',
    name: 'Paramètres',
    icon: Settings,
    path: '/parametre',
    single: true,
  },
];

const CHEF_GROUPS = [
  {
    id: 'team',
    name: 'Mon équipe',
    icon: Users2,
    items: [
      { name: 'Suivi équipe', path: '/suivi-equipe', icon: Activity },
      { name: 'Évaluations', path: '/evaluation', icon: Star },
      { name: 'Primes', path: '/primes', icon: Award },
      { name: 'Recrutement', path: '/recrutement', icon: UserPlus },
      { name: 'Congés', path: '/leaves', icon: Calendar },
    ],
  },
  {
    id: 'work',
    name: 'Travail',
    icon: ListTodo,
    items: [
      { name: 'Tâches', path: '/tasks', icon: ListTodo },
      { name: 'Archives', path: '/archives', icon: FolderArchive },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: Megaphone,
    items: [
      { name: 'Messages', path: '/messages', icon: MessageSquare },
      { name: 'Feedbacks', path: '/feedbacks/admin', icon: Lightbulb },
      { name: 'Enquêtes', path: '/surveys', icon: ClipboardList },
    ],
  },
  {
    id: 'settings',
    name: 'Paramètres',
    icon: Settings,
    path: '/parametre',
    single: true,
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPOSANT GROUPE
══════════════════════════════════════════════════════════════════════════════ */
function NavGroup({ group, isOpen, onToggle, location }) {
  const Icon = group.icon;
  const isActive = group.single
    ? location.pathname === group.path
    : group.items?.some(i => location.pathname === i.path);

  // Groupe à lien direct (single)
  if (group.single) {
    return (
      <Link to={group.path} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 9,
            background: isActive
              ? 'linear-gradient(135deg, #667eea, #764ba2)'
              : 'transparent',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon size={15} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
          <span style={{
            fontSize: 13, fontWeight: isActive ? 600 : 400,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
          }}>
            {group.name}
          </span>
          {isActive && <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }} />}
        </div>
      </Link>
    );
  }

  // Groupe avec sous-items
  const hasActive = group.items?.some(i => location.pathname === i.path);

  return (
    <div style={{ marginBottom: 2 }}>
      {/* En-tête du groupe */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 9,
          background: hasActive && !isOpen
            ? 'rgba(102,126,234,0.15)'
            : isOpen
              ? 'rgba(255,255,255,0.06)'
              : 'transparent',
          cursor: 'pointer', transition: 'all 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          if (!hasActive && !isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        }}
        onMouseLeave={e => {
          if (!hasActive && !isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: hasActive || isOpen
            ? 'linear-gradient(135deg, #667eea, #764ba2)'
            : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          <Icon size={14} style={{ color: hasActive || isOpen ? '#fff' : 'rgba(255,255,255,0.5)' }} />
        </div>

        <span style={{
          fontSize: 13, fontWeight: hasActive || isOpen ? 600 : 400, flex: 1,
          color: hasActive || isOpen ? '#fff' : 'rgba(255,255,255,0.7)',
        }}>
          {group.name}
        </span>

        {/* Badge nombre de sous-items */}
        {!isOpen && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.06)',
            padding: '1px 6px', borderRadius: 4,
          }}>
            {group.items.length}
          </span>
        )}

        <ChevronDown
          size={13}
          style={{
            color: 'rgba(255,255,255,0.4)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            marginLeft: isOpen ? 0 : 4,
          }}
        />
      </div>

      {/* Sous-items */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? `${group.items.length * 44}px` : '0px',
        transition: 'max-height 0.25s ease',
      }}>
        <div style={{ padding: '4px 0 4px 14px' }}>
          {/* Ligne verticale décorative */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 13, top: 4, bottom: 4,
              width: 1, background: 'rgba(255,255,255,0.08)',
            }} />

            {group.items.map((item) => {
              const ItemIcon = item.icon;
              const itemActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 10px 7px 26px', borderRadius: 8, marginBottom: 1,
                      background: itemActive
                        ? 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))'
                        : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!itemActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!itemActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Dot indicateur */}
                    <div style={{
                      position: 'absolute', left: 10,
                      width: itemActive ? 6 : 4, height: itemActive ? 6 : 4,
                      borderRadius: '50%',
                      background: itemActive ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.15s',
                    }} />

                    <ItemIcon size={13} style={{
                      color: itemActive ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 12.5, fontWeight: itemActive ? 600 : 400,
                      color: itemActive ? '#e9d5ff' : 'rgba(255,255,255,0.6)',
                    }}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SIDEBAR PRINCIPAL
══════════════════════════════════════════════════════════════════════════════ */
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, organization, orgName, isAdmin, isChefDept, logout } = useAuth();

  const [userMode, setUserMode] = useState(
    localStorage.getItem('userMode') || 'employee'
  );

  // Groupes ouverts par défaut = celui qui contient la page active
  const getGroups = () => {
    if (isAdmin) return ADMIN_GROUPS;
    if (isChefDept && userMode === 'chef') return CHEF_GROUPS;
    return EMPLOYEE_GROUPS;
  };

  const getDefaultOpen = (groups) => {
    const active = groups.find(g =>
      !g.single && g.items?.some(i => location.pathname === i.path)
    );
    return active ? { [active.id]: true } : {};
  };

  const groups = getGroups();
  const [openGroups, setOpenGroups] = useState(() => getDefaultOpen(groups));

  useEffect(() => {
    const sync = () => setUserMode(localStorage.getItem('userMode') || 'employee');
    window.addEventListener('modeChanged', sync);
    return () => window.removeEventListener('modeChanged', sync);
  }, []);

  // Re-calcule les groupes ouverts quand le mode change
  useEffect(() => {
    const g = getGroups();
    setOpenGroups(getDefaultOpen(g));
  }, [userMode, isAdmin, isChefDept]);

  const toggleGroup = (id) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // Badge rôle
  const roleConfig = isAdmin
    ? { label: 'ADMINISTRATEUR', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: Shield }
    : isChefDept && userMode === 'chef'
      ? { label: 'CHEF DEPT.', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', icon: Award }
      : { label: 'EMPLOYÉ', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: Users };

  const RoleIcon = roleConfig.icon;
  const initiale = user?.full_name?.charAt(0)?.toUpperCase() || '?';
  const currentGroups = getGroups();

  return (
    <div style={{
      width: 230, flexShrink: 0,
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      height: '100vh', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(102,126,234,0.35)',
          }}>
            <Building2 size={15} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>CommSight</div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Plateforme RH</div>
          </div>
        </div>

        {/* Entreprise */}
        <div style={{
          padding: '9px 11px', borderRadius: 9,
          background: 'rgba(102,126,234,0.1)',
          border: '1px solid rgba(102,126,234,0.18)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10.5, fontWeight: 700, color: '#fff',
          }}>
            {orgName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontSize: 11.5, fontWeight: 600, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {orgName}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
              {organization?.industry || 'Entreprise'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Badge rôle ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 10px', borderRadius: 7,
          background: roleConfig.bg,
          border: `1px solid ${roleConfig.color}28`,
        }}>
          <RoleIcon size={12} style={{ color: roleConfig.color, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: roleConfig.color, letterSpacing: '0.08em' }}>
            {roleConfig.label}
          </span>
        </div>
      </div>

      {/* ── Navigation groupée ─────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>

        {/* Label section */}
        <div style={{
          fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 12px', marginBottom: 8,
        }}>
          Navigation
        </div>

        {currentGroups.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            isOpen={!!openGroups[group.id]}
            onToggle={() => toggleGroup(group.id)}
            location={location}
          />
        ))}
      </nav>

      {/* ── Profil + Déconnexion ────────────────────────────────────────────── */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 11px', borderRadius: 9,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 7,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {initiale}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.full_name}
            </div>
            <div style={{
              fontSize: 10.5, color: 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '7px 11px', borderRadius: 8,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.18)',
            display: 'flex', alignItems: 'center', gap: 7,
            cursor: 'pointer', transition: 'all 0.15s',
            color: 'rgba(239,68,68,0.75)', fontSize: 12, fontWeight: 500,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.14)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)';
          }}
        >
          <LogOut size={13} />
          Se déconnecter
        </button>

        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 9.5, color: 'rgba(255,255,255,0.15)' }}>
          CommSight · © 2026
        </div>
      </div>
    </div>
  );
}