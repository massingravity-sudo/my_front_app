import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ListTodo, MessageSquare, Calendar,
  FileText, BarChart3, Settings, Building2, FolderArchive,
  ClipboardList, Lightbulb, Award, Shield, TrendingUp,
  Crown, Users, Activity, Star, UserPlus, LogOut, ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, organization, orgName, isAdmin, isChefDept, logout } = useAuth();

  const [userMode, setUserMode] = useState(
    localStorage.getItem('userMode') || 'employee'
  );

  useEffect(() => {
    const handleModeChange = () => {
      setUserMode(localStorage.getItem('userMode') || 'employee');
    };
    window.addEventListener('modeChanged', handleModeChange);
    return () => window.removeEventListener('modeChanged', handleModeChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ── Navigations ────────────────────────────────────────────────────────────
  const employeeNavigation = [
    { name: 'Mes Tâches', path: '/tasks', icon: ListTodo },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Mes Congés', path: '/leaves', icon: Calendar },
    { name: 'Actualités', path: '/posts', icon: FileText },
    { name: 'Archives', path: '/archives', icon: FolderArchive },
    { name: 'Enquêtes', path: '/surveys', icon: ClipboardList },
    { name: 'Boîte à Idées', path: '/feedbacks', icon: Lightbulb },
    { name: 'Paramètres', path: '/parametre', icon: Settings },
  ];

  const chefNavigation = [
    { name: 'Suivi Équipe', path: '/suivi-equipe', icon: Activity },
    { name: 'Évaluations', path: '/evaluation', icon: Star },
    { name: 'Primes', path: '/primes', icon: Award },
    { name: 'Recrutement', path: '/recrutement', icon: UserPlus },
    { name: 'Tâches', path: '/tasks', icon: ListTodo },
    { name: 'Congés', path: '/leaves', icon: Calendar },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Feedbacks', path: '/feedbacks/admin', icon: Lightbulb },
    { name: 'Paramètres', path: '/parametre', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tâches', path: '/tasks', icon: ListTodo },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Congés', path: '/leaves', icon: Calendar },
    { name: 'Actualités', path: '/posts', icon: FileText },
    { name: 'Archives', path: '/archives', icon: FolderArchive },
    { name: 'Enquêtes', path: '/surveys', icon: ClipboardList },
    { name: 'Feedbacks', path: '/feedbacks/admin', icon: Lightbulb },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Chefs de département', path: '/manage-chefs', icon: Crown, highlight: true },
    { name: 'Paramètres', path: '/parametre', icon: Settings },
  ];

  let navigation = employeeNavigation;
  if (isAdmin) {
    navigation = adminNavigation;
  } else if (isChefDept && userMode === 'chef') {
    navigation = chefNavigation;
  }

  // ── Badge rôle ─────────────────────────────────────────────────────────────
  const roleConfig = isAdmin
    ? { label: 'ADMINISTRATEUR', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: Shield }
    : isChefDept
      ? { label: 'CHEF DEPT.', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', icon: Award }
      : { label: 'EMPLOYÉ', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: Users };

  const RoleIcon = roleConfig.icon;

  // Initiale utilisateur
  const initiale = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* ── Header — Logo + Nom entreprise ────────────────────────────────── */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Logo CommSight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(102,126,234,0.35)',
          }}>
            <Building2 size={17} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              CommSight
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
              Plateforme RH
            </div>
          </div>
        </div>

        {/* Nom de l'entreprise */}
        <div style={{
          padding: '10px 12px',
          background: 'rgba(102,126,234,0.12)',
          border: '1px solid rgba(102,126,234,0.2)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {orgName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {orgName}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
              {organization?.industry || 'Entreprise'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Badge rôle ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', borderRadius: 8,
          background: roleConfig.bg,
          border: `1px solid ${roleConfig.color}30`,
        }}>
          <RoleIcon size={13} style={{ color: roleConfig.color, flexShrink: 0 }} />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: roleConfig.color, letterSpacing: '0.08em' }}>
            {roleConfig.label}
          </span>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.highlight) {
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 9, marginBottom: 2,
                  background: isActive
                    ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                    : 'rgba(124,58,237,0.1)',
                  border: `1px solid ${isActive ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <Icon size={15} style={{ color: isActive ? '#fff' : '#a78bfa', flexShrink: 0 }} />
                  <span style={{
                    fontSize: 13, fontWeight: 600, flex: 1,
                    color: isActive ? '#fff' : '#a78bfa',
                  }}>
                    {item.name}
                  </span>
                  {!isActive && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: '#fff',
                      background: '#7c3aed', padding: '2px 5px', borderRadius: 4,
                    }}>
                      ADMIN
                    </span>
                  )}
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, marginBottom: 2,
                background: isActive
                  ? 'linear-gradient(135deg, #667eea, #764ba2)'
                  : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={15} style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                }}>
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 'auto' }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Profil utilisateur + Déconnexion ───────────────────────────────── */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 8,
        }}>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            {initiale}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontSize: 12.5, fontWeight: 600, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.full_name}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 9,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', transition: 'all 0.15s',
            color: 'rgba(239,68,68,0.8)', fontSize: 12.5, fontWeight: 500,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
          }}
        >
          <LogOut size={14} />
          Se déconnecter
        </button>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
          CommSight · © 2026
        </div>
      </div>
    </div>
  );
}