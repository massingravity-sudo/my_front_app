import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell, User, LogOut, Settings, ChevronDown,
  Briefcase, Shield, Crown,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Tableau de bord',
  '/tasks': 'Gestion des tâches',
  '/messages': 'Messagerie',
  '/leaves': 'Congés',
  '/posts': 'Actualités',
  '/archives': 'Archives',
  '/surveys': 'Enquêtes',
  '/feedbacks': 'Boîte à Idées',
  '/feedbacks/admin': 'Feedbacks équipe',
  '/hr': 'Gestion RH',
  '/analytics': 'Analytics',
  '/parametre': 'Paramètres',
  '/manage-chefs': 'Chefs de Département',  // ← nouveau
};

export default function Topbar() {
  const { user, logout, isAdmin, isChefDept } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userMode, setUserMode] = useState(
    localStorage.getItem('userMode') || 'employee'
  );

  /* ── Sync mode depuis Sidebar / autres composants ── */
  useEffect(() => {
    const sync = () => setUserMode(localStorage.getItem('userMode') || 'employee');
    window.addEventListener('modeChanged', sync);
    return () => window.removeEventListener('modeChanged', sync);
  }, []);

  /* ── Réinitialiser le mode si l'user n'est plus chef ── */
  useEffect(() => {
    if (!isChefDept && !isAdmin) {
      localStorage.setItem('userMode', 'employee');
      setUserMode('employee');
    }
  }, [isChefDept, isAdmin]);

  /* ── Basculer mode employé ↔ chef ── */
  const handleSwitchMode = () => {
    const newMode = userMode === 'employee' ? 'chef' : 'employee';
    setUserMode(newMode);
    localStorage.setItem('userMode', newMode);
    window.dispatchEvent(new Event('modeChanged'));
    navigate(newMode === 'chef' ? '/hr' : '/dashboard');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageTitle = PAGE_TITLES[location.pathname] || 'CommSight';

  /* ── Label rôle cohérent ── */
  const roleLabel = isAdmin
    ? 'Administrateur'
    : isChefDept
      ? userMode === 'chef'
        ? `Chef · ${user?.department || 'Département'}`
        : 'Employé'
      : 'Employé';

  /* ── Badge couleur ── */
  const badgeClass = isAdmin
    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    : isChefDept
      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';

  const badgeLabel = isAdmin ? 'ADMIN' : isChefDept ? 'CHEF DEPT.' : 'EMPLOYÉ';

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between flex-shrink-0">

      {/* ── Titre page ── */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{pageTitle}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* ── Actions droite ── */}
      <div className="flex items-center gap-3">

        {/* ── Switch mode — Chef de département UNIQUEMENT (pas admin) ── */}
        {isChefDept && !isAdmin && (
          <button
            onClick={handleSwitchMode}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg ${userMode === 'chef'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              }`}
          >
            {userMode === 'chef' ? (
              <><Briefcase className="w-4 h-4" /><span>Mode Employé</span></>
            ) : (
              <><Shield className="w-4 h-4" /><span>Mode Chef</span></>
            )}
            <span className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${userMode === 'chef' ? 'bg-purple-400 text-white' : 'bg-emerald-400 text-white'
              }`}>
              {userMode === 'chef' ? 'CHEF' : 'EMP'}
            </span>
          </button>
        )}

        {/* ── Notifications ── */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">0</span>
              </div>
              <div className="p-6 text-center">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Aucune nouvelle notification</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Menu utilisateur ── */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user?.full_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabel}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
              {/* Info utilisateur */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                  {badgeLabel}
                </span>
              </div>

              {/* ── Lien switch mode dans le menu (pour les chefs) ── */}
              {isChefDept && !isAdmin && (
                <div className="px-2 pt-2">
                  <button
                    onClick={() => { handleSwitchMode(); setShowUserMenu(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm font-semibold ${userMode === 'chef'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      }`}
                  >
                    {userMode === 'chef'
                      ? <><Briefcase className="w-4 h-4" /> Passer en mode Employé</>
                      : <><Crown className="w-4 h-4" /> Passer en mode Chef</>}
                  </button>
                  <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
                </div>
              )}

              <div className="p-2">
                <button
                  onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Mon profil</span>
                </button>
                <button
                  onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Paramètres</span>
                </button>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400 font-semibold">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}