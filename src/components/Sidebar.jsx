import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ListTodo, MessageSquare, Calendar,
  FileText, BarChart3, Settings, Building2, FolderArchive,
  ClipboardList, Lightbulb, Award, Shield, TrendingUp, Crown, Users,
} from 'lucide-react';

import { Activity, Star, UserPlus } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, isAdmin, isChefDept } = useAuth();

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

  /* ── Navigations ── */
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
    { name: "Vue d'ensemble RH", path: '/hr', icon: TrendingUp },
    { name: 'Tâches équipe', path: '/tasks', icon: ListTodo },
    { name: 'Suivi Équipe', path: '/suivi-equipe', icon: Activity },
    { name: 'Évaluations', path: '/evaluation', icon: Star },
    { name: 'Primes', path: '/primes', icon: Award },
    { name: 'Recrutement', path: '/recrutement', icon: UserPlus },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Tâches', path: '/tasks', icon: ListTodo },
    { name: 'Congés', path: '/leaves', icon: Calendar },
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

  /* ── Choisir la nav selon le rôle ── */
  let navigation = employeeNavigation;
  if (isAdmin) {
    navigation = adminNavigation;
  } else if (isChefDept && userMode === 'chef') {
    navigation = chefNavigation;
  }

  /* ── Sous-titre ── */
  const subtitle = isAdmin
    ? 'Administration'
    : isChefDept && userMode === 'chef'
      ? `Chef · ${user?.department || 'Département'}`
      : 'Espace Personnel';

  /* ── Badge rôle ── */
  const roleBadge = isAdmin
    ? { label: 'ADMINISTRATEUR', bg: 'bg-red-600/20 border-red-500/30 text-red-300', icon: Shield }
    : isChefDept
      ? { label: 'CHEF DEPT.', bg: 'bg-purple-600/20 border-purple-500/30 text-purple-300', icon: Award }
      : { label: 'EMPLOYÉ', bg: 'bg-blue-600/20 border-blue-500/30 text-blue-300', icon: Users };

  const BadgeIcon = roleBadge.icon;

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col flex-shrink-0">

      {/* ── Logo ── */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CommSight</h1>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Badge rôle ── */}
      <div className="px-4 py-3 bg-slate-800/60">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${roleBadge.bg}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{roleBadge.label}</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.highlight) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-purple-300 bg-purple-900/20 border border-purple-800/40 hover:bg-purple-900/40 hover:text-purple-200'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm flex-1">{item.name}</span>
                <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  ADMIN
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Info utilisateur en bas ── */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="text-xs text-slate-600 text-center">CommSight · © 2026</div>
      </div>
    </div>
  );
}