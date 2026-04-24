import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell, User, LogOut, Settings, ChevronDown,
  Briefcase, Shield, Crown, UserPlus, X,
  Mail, CheckCircle, Copy, AlertCircle, Building2,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

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
  '/manage-chefs': 'Chefs de Département',
};

// ── Modal Invitation ──────────────────────────────────────────────────────────
function InviteModal({ onClose }) {
  const { orgName } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    role: 'employee',
    department: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/invite`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (success?.invite_url) {
      navigator.clipboard.writeText(success.invite_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    setError('');
    setFormData({ email: '', role: 'employee', department: '', position: '' });
  };

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .invite-modal { animation: modalFadeIn 0.2s ease both; }
        .invite-input {
          width: 100%; padding: 0 12px; height: 38px; border-radius: 9px;
          border: 1px solid #e5e5e5; background: #fff; font-size: 13.5px;
          color: #171717; font-family: 'Inter', sans-serif;
          transition: border-color 0.15s; outline: none;
        }
        .invite-input:focus { border-color: #171717; }
        .invite-input::placeholder { color: #a3a3a3; }
        .invite-select {
          width: 100%; padding: 0 12px; height: 38px; border-radius: 9px;
          border: 1px solid #e5e5e5; background: #fff; font-size: 13.5px;
          color: #171717; font-family: 'Inter', sans-serif;
          transition: border-color 0.15s; outline: none; cursor: pointer;
          appearance: none;
        }
        .invite-select:focus { border-color: #171717; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(2px)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        {/* Modale */}
        <div
          className="invite-modal"
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 480,
            background: '#fff', borderRadius: 16,
            border: '1px solid #e5e5e5',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >

          {/* Header */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: '#f5f5f5', border: '1px solid #e5e5e5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <UserPlus size={16} color="#525252" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                  Inviter un employé
                </div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 1 }}>
                  {orgName}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e5e5',
                background: '#fafafa', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
            >
              <X size={14} color="#737373" />
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px' }}>

            {/* Succès */}
            {success ? (
              <div>
                <div style={{
                  padding: '20px', borderRadius: 12,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  textAlign: 'center', marginBottom: 20,
                }}>
                  <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', marginBottom: 4 }}>
                    Invitation envoyée !
                  </div>
                  <div style={{ fontSize: 12.5, color: '#16a34a' }}>
                    Un email a été envoyé à <strong>{formData.email}</strong>
                  </div>
                </div>

                {/* Lien copier */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#737373', marginBottom: 6, fontWeight: 500 }}>
                    Ou partagez ce lien directement :
                  </div>
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    padding: '8px 12px', borderRadius: 9,
                    background: '#fafafa', border: '1px solid #e5e5e5',
                  }}>
                    <span style={{
                      fontSize: 11.5, color: '#737373', flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {success.invite_url}
                    </span>
                    <button
                      onClick={handleCopy}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 6, flexShrink: 0,
                        background: copied ? '#f0fdf4' : '#fff',
                        border: `1px solid ${copied ? '#bbf7d0' : '#e5e5e5'}`,
                        cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        color: copied ? '#15803d' : '#525252',
                        transition: 'all 0.15s',
                      }}
                    >
                      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleReset}
                    style={{
                      flex: 1, height: 38, borderRadius: 9,
                      border: '1px solid #e5e5e5', background: '#fafafa',
                      cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
                      color: '#525252', transition: 'all 0.15s',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
                  >
                    Inviter un autre
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1, height: 38, borderRadius: 9,
                      border: '1px solid #171717', background: '#171717',
                      cursor: 'pointer', fontSize: 13.5, fontWeight: 500,
                      color: '#fff', transition: 'all 0.15s',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#262626'}
                    onMouseLeave={e => e.currentTarget.style.background = '#171717'}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={handleSubmit}>

                {/* Erreur */}
                {error && (
                  <div style={{
                    marginBottom: 16, padding: '10px 12px',
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: '#991b1b' }}>{error}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#525252', marginBottom: 6 }}>
                      Email de l'employé *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} color="#a3a3a3" style={{
                        position: 'absolute', left: 12, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none',
                      }} />
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="employe@entreprise.com"
                        className="invite-input"
                        style={{ paddingLeft: 34 }}
                      />
                    </div>
                  </div>

                  {/* Rôle */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#525252', marginBottom: 6 }}>
                      Rôle
                    </label>
                    <select
                      className="invite-select"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="employee">Employé</option>
                      <option value="manager">Manager / Chef de département</option>
                    </select>
                  </div>

                  {/* Département + Poste */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#525252', marginBottom: 6 }}>
                        Département
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Ex: IT, RH..."
                        className="invite-input"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#525252', marginBottom: 6 }}>
                        Poste
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Ex: Développeur..."
                        className="invite-input"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: '10px 12px', borderRadius: 9,
                    background: '#fafafa', border: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <Building2 size={13} color="#a3a3a3" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: '#737373', lineHeight: 1.5 }}>
                      L'employé recevra un email avec un lien d'inscription valable <strong>7 jours</strong>. Il sera automatiquement lié à <strong>{orgName}</strong>.
                    </span>
                  </div>

                  {/* Bouton envoyer */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', height: 40, borderRadius: 9,
                      background: loading ? '#d4d4d4' : '#171717',
                      border: `1px solid ${loading ? '#d4d4d4' : '#171717'}`,
                      color: '#fff', fontSize: 13.5, fontWeight: 500,
                      fontFamily: 'Inter, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#262626'; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#171717'; }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 14, height: 14, borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Envoyer l'invitation
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Topbar principal ──────────────────────────────────────────────────────────
export default function Topbar() {
  const { user, logout, isAdmin, isChefDept, orgName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [userMode, setUserMode] = useState(
    localStorage.getItem('userMode') || 'employee'
  );

  useEffect(() => {
    const sync = () => setUserMode(localStorage.getItem('userMode') || 'employee');
    window.addEventListener('modeChanged', sync);
    return () => window.removeEventListener('modeChanged', sync);
  }, []);

  useEffect(() => {
    if (!isChefDept && !isAdmin) {
      localStorage.setItem('userMode', 'employee');
      setUserMode('employee');
    }
  }, [isChefDept, isAdmin]);

  const handleSwitchMode = () => {
    const newMode = userMode === 'employee' ? 'chef' : 'employee';
    setUserMode(newMode);
    localStorage.setItem('userMode', newMode);
    window.dispatchEvent(new Event('modeChanged'));
    navigate(newMode === 'chef' ? '/hr' : '/dashboard');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageTitle = PAGE_TITLES[location.pathname] || 'CommSight';

  const roleLabel = isAdmin
    ? 'Administrateur'
    : isChefDept
      ? userMode === 'chef' ? `Chef · ${user?.department || 'Département'}` : 'Employé'
      : 'Employé';

  const badgeClass = isAdmin
    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    : isChefDept
      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';

  const badgeLabel = isAdmin ? 'ADMIN' : isChefDept ? 'CHEF DEPT.' : 'EMPLOYÉ';

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between flex-shrink-0">

        {/* Titre page */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{pageTitle}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {orgName} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-2">

          {/* ── Bouton Inviter — Admin uniquement ── */}
          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: 36, borderRadius: 9,
                background: '#171717', color: '#fff',
                border: '1px solid #171717',
                fontSize: 13, fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer', transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#262626'}
              onMouseLeave={e => e.currentTarget.style.background = '#171717'}
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Inviter un employé</span>
              <span className="sm:hidden">Inviter</span>
            </button>
          )}

          {/* Switch mode — Chef uniquement */}
          {isChefDept && !isAdmin && (
            <button
              onClick={handleSwitchMode}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${userMode === 'chef'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                }`}
            >
              {userMode === 'chef'
                ? <><Briefcase className="w-4 h-4" /><span>Mode Employé</span></>
                : <><Shield className="w-4 h-4" /><span>Mode Chef</span></>}
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</h3>
                </div>
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Aucune nouvelle notification</p>
                </div>
              </div>
            )}
          </div>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{user?.full_name}</p>
                <p className="text-[11px] text-slate-400">{roleLabel}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                    {badgeLabel}
                  </span>
                </div>

                {isChefDept && !isAdmin && (
                  <div className="px-2 pt-2">
                    <button
                      onClick={() => { handleSwitchMode(); setShowUserMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-semibold ${userMode === 'chef'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-purple-50 text-purple-700'
                        }`}
                    >
                      {userMode === 'chef'
                        ? <><Briefcase className="w-3.5 h-3.5" />Passer en mode Employé</>
                        : <><Crown className="w-3.5 h-3.5" />Passer en mode Chef</>}
                    </button>
                    <div className="my-2 border-t border-slate-100" />
                  </div>
                )}

                <div className="p-2">
                  <button
                    onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Mon profil</span>
                  </button>
                  <button
                    onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Paramètres</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs text-red-600 font-semibold">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal invitation */}
      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </>
  );
}