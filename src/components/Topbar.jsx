/**
 * Layout.jsx — Layout principal CommSight
 * Style : navigation horizontale en haut + sidebar gauche minimaliste
 * Inspiré du design moderne de l'image fournie
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ListTodo, MessageSquare, Calendar,
  FileText, BarChart3, Settings, Building2, FolderArchive,
  ClipboardList, Lightbulb, Award, Users, Activity,
  Star, UserPlus, LogOut, Bell, ChevronDown,
  Plus, Shield, Crown, Briefcase, X,
  Mail, CheckCircle, Copy, AlertCircle,
  Search, Hash,
} from 'lucide-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

/* ══════════════════════════════════════════════════════════════════════════════
   CONFIGS DE NAVIGATION PAR RÔLE
══════════════════════════════════════════════════════════════════════════════ */

// Onglets navigation horizontale (topnav)
const ADMIN_TABS = [
  { id: 'dashboard', label: 'Vue d\'ensemble', path: '/dashboard' },
  { id: 'tasks', label: 'Tâches', path: '/tasks' },
  { id: 'messages', label: 'Messages', path: '/messages' },
  { id: 'analytics', label: 'Analytics', path: '/analytics' },
  {
    id: 'rh', label: 'RH', path: '/leaves',
    sub: [
      { label: 'Congés', path: '/leaves' },
      { label: 'Chefs de dept.', path: '/manage-chefs' },
    ]
  },
  { id: 'params', label: 'Paramètres', path: '/parametre' },
];

const EMPLOYEE_TABS = [
  { id: 'tasks', label: 'Mes tâches', path: '/tasks' },
  { id: 'messages', label: 'Messages', path: '/messages' },
  { id: 'leaves', label: 'Congés', path: '/leaves' },
  {
    id: 'content', label: 'Contenu', path: '/posts',
    sub: [
      { label: 'Actualités', path: '/posts' },
      { label: 'Enquêtes', path: '/surveys' },
      { label: 'Boîte à idées', path: '/feedbacks' },
    ]
  },
  { id: 'archives', label: 'Archives', path: '/archives' },
  { id: 'params', label: 'Paramètres', path: '/parametre' },
];

const CHEF_TABS = [
  {
    id: 'team', label: 'Mon équipe', path: '/suivi-equipe',
    sub: [
      { label: 'Suivi équipe', path: '/suivi-equipe' },
      { label: 'Évaluations', path: '/evaluation' },
      { label: 'Primes', path: '/primes' },
      { label: 'Recrutement', path: '/recrutement' },
    ]
  },
  { id: 'tasks', label: 'Tâches', path: '/tasks' },
  { id: 'messages', label: 'Messages', path: '/messages' },
  { id: 'leaves', label: 'Congés', path: '/leaves' },
  { id: 'feedbacks', label: 'Feedbacks', path: '/feedbacks/admin' },
  { id: 'params', label: 'Paramètres', path: '/parametre' },
];

// Sidebar gauche — catégories condensées
const ADMIN_SIDEBAR = [
  {
    section: 'PRINCIPAL',
    items: [
      { label: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, badge: null },
      { label: 'Employés', path: '/manage-chefs', icon: Users, badge: null },
      { label: 'Messages', path: '/messages', icon: MessageSquare, badge: null },
    ],
  },
  {
    section: 'TÂCHES',
    items: [
      { label: 'En cours', path: '/tasks', icon: null, dot: '#3b82f6' },
      { label: 'En attente', path: '/tasks', icon: null, dot: '#a3a3a3' },
    ],
  },
  {
    section: 'INTELLIGENCE',
    items: [
      { label: 'Analytics', path: '/analytics', icon: BarChart3, badge: null },
    ],
  },
];

const EMPLOYEE_SIDEBAR = [
  {
    section: 'PRINCIPAL',
    items: [
      { label: 'Mes tâches', path: '/tasks', icon: ListTodo, badge: null },
      { label: 'Messages', path: '/messages', icon: MessageSquare, badge: null },
      { label: 'Congés', path: '/leaves', icon: Calendar, badge: null },
    ],
  },
  {
    section: 'CONTENU',
    items: [
      { label: 'Actualités', path: '/posts', icon: FileText, badge: null },
      { label: 'Enquêtes', path: '/surveys', icon: ClipboardList, badge: null },
      { label: 'Boîte à idées', path: '/feedbacks', icon: Lightbulb, badge: null },
    ],
  },
];

const CHEF_SIDEBAR = [
  {
    section: 'ÉQUIPE',
    items: [
      { label: 'Suivi équipe', path: '/suivi-equipe', icon: Activity, badge: null },
      { label: 'Évaluations', path: '/evaluation', icon: Star, badge: null },
      { label: 'Primes', path: '/primes', icon: Award, badge: null },
    ],
  },
  {
    section: 'TÂCHES',
    items: [
      { label: 'En cours', path: '/tasks', icon: null, dot: '#3b82f6' },
      { label: 'En attente', path: '/tasks', icon: null, dot: '#a3a3a3' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MODAL INVITATION
══════════════════════════════════════════════════════════════════════════════ */
function InviteModal({ onClose }) {
  const { orgName } = useAuth();
  const [form, setForm] = useState({ email: '', role: 'employee', department: '', position: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/invite`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(success?.invite_url || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 460, background: '#fff',
        borderRadius: 16, border: '1px solid #e5e5e5',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        fontFamily: 'Inter,sans-serif', overflow: 'hidden',
        animation: 'modalIn 0.2s ease both',
      }}>
        <style>{`
          @keyframes modalIn { from{opacity:0;transform:translateY(-8px) scale(0.98)} to{opacity:1;transform:none} }
          @keyframes spinInv { to{transform:rotate(360deg)} }
          .inv-in { width:100%;padding:0 12px;height:38px;border-radius:9px;border:1px solid #e5e5e5;background:#fff;font-size:13.5px;color:#171717;font-family:Inter,sans-serif;outline:none;transition:border-color .15s }
          .inv-in:focus{border-color:#171717}
          .inv-in::placeholder{color:#a3a3a3}
        `}</style>

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid #e5e5e5', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={15} color="#525252" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>Inviter un employé</div>
              <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 1 }}>{orgName}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e5e5', background: '#fafafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color="#737373" />
          </button>
        </div>

        <div style={{ padding: '18px 22px 22px' }}>
          {success ? (
            <div>
              <div style={{ padding: 18, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center', marginBottom: 16 }}>
                <CheckCircle size={28} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#15803d' }}>Invitation envoyée à <strong>{form.email}</strong></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#737373', marginBottom: 6, fontWeight: 500 }}>Lien à partager :</div>
                <div style={{ display: 'flex', gap: 8, padding: '7px 11px', borderRadius: 9, background: '#fafafa', border: '1px solid #e5e5e5' }}>
                  <span style={{ fontSize: 11.5, color: '#737373', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{success.invite_url}</span>
                  <button onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, background: copied ? '#f0fdf4' : '#fff', border: `1px solid ${copied ? '#bbf7d0' : '#e5e5e5'}`, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: copied ? '#15803d' : '#525252', fontFamily: 'Inter,sans-serif' }}>
                    {copied ? <CheckCircle size={11} /> : <Copy size={11} />}{copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setSuccess(null); setForm({ email: '', role: 'employee', department: '', position: '' }); }} style={{ flex: 1, height: 38, borderRadius: 9, border: '1px solid #e5e5e5', background: '#fafafa', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#525252', fontFamily: 'Inter,sans-serif' }}>Inviter un autre</button>
                <button onClick={onClose} style={{ flex: 1, height: 38, borderRadius: 9, border: '1px solid #171717', background: '#171717', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#fff', fontFamily: 'Inter,sans-serif' }}>Fermer</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && <div style={{ marginBottom: 12, padding: '9px 12px', borderRadius: 9, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 7 }}><AlertCircle size={13} color="#dc2626" /><span style={{ fontSize: 12.5, color: '#991b1b' }}>{error}</span></div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#525252', marginBottom: 5 }}>Email *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={13} color="#a3a3a3" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input type="email" required className="inv-in" style={{ paddingLeft: 32 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="employe@entreprise.com" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#525252', marginBottom: 5 }}>Rôle</label>
                  <select className="inv-in" style={{ appearance: 'none', cursor: 'pointer' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="employee">Employé</option>
                    <option value="manager">Manager / Chef de département</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#525252', marginBottom: 5 }}>Département</label>
                    <input type="text" className="inv-in" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="IT, RH..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#525252', marginBottom: 5 }}>Poste</label>
                    <input type="text" className="inv-in" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Développeur..." />
                  </div>
                </div>
                <div style={{ padding: '9px 11px', borderRadius: 9, background: '#fafafa', border: '1px solid #f0f0f0', display: 'flex', gap: 7 }}>
                  <Building2 size={12} color="#a3a3a3" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11.5, color: '#737373', lineHeight: 1.5 }}>Lien valable <strong>7 jours</strong>, lié automatiquement à <strong>{orgName}</strong>.</span>
                </div>
                <button type="submit" disabled={loading} style={{ height: 40, borderRadius: 9, background: loading ? '#d4d4d4' : '#171717', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: 'Inter,sans-serif', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background .15s' }}>
                  {loading ? <><div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spinInv 0.7s linear infinite' }} />Envoi...</> : <><UserPlus size={13} />Envoyer l'invitation</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   LAYOUT PRINCIPAL
══════════════════════════════════════════════════════════════════════════════ */
export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, organization, orgName, isAdmin, isChefDept, logout } = useAuth();

  const [userMode, setUserMode] = useState(localStorage.getItem('userMode') || 'employee');
  const [showInvite, setShowInvite] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const sync = () => setUserMode(localStorage.getItem('userMode') || 'employee');
    window.addEventListener('modeChanged', sync);
    return () => window.removeEventListener('modeChanged', sync);
  }, []);

  // Ferme les menus au clic extérieur
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false); setShowNotifs(false); setOpenSubMenu(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const switchMode = () => {
    const m = userMode === 'employee' ? 'chef' : 'employee';
    setUserMode(m);
    localStorage.setItem('userMode', m);
    window.dispatchEvent(new Event('modeChanged'));
    navigate(m === 'chef' ? '/suivi-equipe' : '/tasks');
  };

  // Sélectionner les configs selon le rôle
  const tabs = isAdmin ? ADMIN_TABS : isChefDept && userMode === 'chef' ? CHEF_TABS : EMPLOYEE_TABS;
  const sidebar = isAdmin ? ADMIN_SIDEBAR : isChefDept && userMode === 'chef' ? CHEF_SIDEBAR : EMPLOYEE_SIDEBAR;

  const initiale = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  // Vérifie si un onglet est actif (lui ou un de ses sous-items)
  const isTabActive = (tab) => {
    if (tab.path === location.pathname) return true;
    if (tab.sub) return tab.sub.some(s => s.path === location.pathname);
    return false;
  };

  // Vérifie si un item sidebar est actif
  const isSidebarActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { font-family: 'Inter', -apple-system, sans-serif; background:#f8f8f8; color:#171717; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e5e5e5; border-radius:4px; }

        /* Tab hover */
        .cs-tab:hover .cs-tab-bg { background:#f5f5f5 !important; }

        /* Sidebar item hover */
        .cs-sitem:hover { background:#f5f5f5 !important; }

        /* Sub-menu */
        .cs-submenu {
          position:absolute; top:calc(100% + 4px); left:0;
          background:#fff; border:1px solid #e5e5e5; border-radius:10px;
          box-shadow:0 8px 24px rgba(0,0,0,0.08); z-index:200;
          padding:6px; min-width:180px;
          animation:subIn 0.15s ease both;
        }
        @keyframes subIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
        .cs-submenu-item {
          display:block; padding:8px 12px; border-radius:7px; font-size:13px;
          color:#525252; text-decoration:none; transition:background .1s; cursor:pointer;
          font-family:Inter,sans-serif;
        }
        .cs-submenu-item:hover { background:#f5f5f5; color:#171717; }
        .cs-submenu-item.active { background:#f0f0f0; color:#171717; font-weight:500; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8f8f8' }}>

        {/* ════════════════════════════════════════════════════════════════════
            TOPBAR — logo + onglets + actions
        ════════════════════════════════════════════════════════════════════ */}
        <header style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 0, flexShrink: 0,
          fontFamily: 'Inter,sans-serif',
          position: 'relative', zIndex: 100,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', borderRight: '1px solid #f0f0f0', marginRight: 4, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#171717',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={15} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1 }}>CommSight</div>
              <div style={{ fontSize: 9.5, color: '#a3a3a3', marginTop: 1, letterSpacing: '-0.01em' }}>
                {orgName?.length > 16 ? orgName.slice(0, 14) + '…' : orgName}
              </div>
            </div>
          </div>

          {/* ── Onglets navigation ── */}
          <nav style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1, padding: '0 4px' }} ref={menuRef}>
            {tabs.map((tab) => {
              const active = isTabActive(tab);
              const hasSub = tab.sub && tab.sub.length > 0;

              return (
                <div key={tab.id} style={{ position: 'relative' }} className="cs-tab">
                  <button
                    onClick={() => {
                      if (hasSub) {
                        setOpenSubMenu(openSubMenu === tab.id ? null : tab.id);
                      } else {
                        navigate(tab.path);
                        setOpenSubMenu(null);
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', borderRadius: 8, border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif', transition: 'all .15s',
                      position: 'relative',
                    }}
                  >
                    {/* Fond au hover */}
                    <div className="cs-tab-bg" style={{
                      position: 'absolute', inset: 0, borderRadius: 8,
                      background: active ? '#f0f0f0' : 'transparent',
                      transition: 'background .15s',
                    }} />

                    <span style={{
                      position: 'relative', zIndex: 1,
                      fontSize: 13.5, fontWeight: active ? 600 : 450,
                      color: active ? '#171717' : '#525252',
                      letterSpacing: '-0.01em',
                    }}>
                      {tab.label}
                    </span>

                    {hasSub && (
                      <ChevronDown size={12} color={active ? '#525252' : '#a3a3a3'}
                        style={{ position: 'relative', zIndex: 1, transform: openSubMenu === tab.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                      />
                    )}

                    {/* Trait actif en bas */}
                    {active && (
                      <div style={{
                        position: 'absolute', bottom: -1, left: 12, right: 12, height: 2,
                        background: '#171717', borderRadius: 2,
                      }} />
                    )}
                  </button>

                  {/* Sous-menu */}
                  {hasSub && openSubMenu === tab.id && (
                    <div className="cs-submenu">
                      {tab.sub.map(s => (
                        <Link
                          key={s.path} to={s.path}
                          className={`cs-submenu-item${location.pathname === s.path ? ' active' : ''}`}
                          onClick={() => setOpenSubMenu(null)}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Actions droite ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, paddingLeft: 8 }}>

            {/* Switch mode chef */}
            {isChefDept && !isAdmin && (
              <button
                onClick={switchMode}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0 12px', height: 32, borderRadius: 8,
                  border: `1px solid ${userMode === 'chef' ? '#ddd6fe' : '#bbf7d0'}`,
                  background: userMode === 'chef' ? '#f5f3ff' : '#f0fdf4',
                  color: userMode === 'chef' ? '#7c3aed' : '#16a34a',
                  fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', transition: 'all .15s',
                }}
              >
                {userMode === 'chef' ? <><Briefcase size={12} />Mode Employé</> : <><Shield size={12} />Mode Chef</>}
              </button>
            )}

            {/* Bouton + Inviter (admin) */}
            {isAdmin && (
              <button
                onClick={() => setShowInvite(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 34, borderRadius: 9,
                  background: '#171717', border: '1px solid #171717',
                  color: '#fff', fontSize: 13, fontWeight: 500,
                  fontFamily: 'Inter,sans-serif', cursor: 'pointer',
                  letterSpacing: '-0.01em', transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#262626'}
                onMouseLeave={e => e.currentTarget.style.background = '#171717'}
              >
                <Plus size={14} strokeWidth={2.5} />
                Nouveau
              </button>
            )}

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: '1px solid #e5e5e5',
                  background: '#fff', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'all .15s', position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <Bell size={16} color="#737373" strokeWidth={1.8} />
                <span style={{
                  position: 'absolute', top: 7, right: 7,
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#ef4444', border: '1.5px solid #fff',
                }} />
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                  width: 280, background: '#fff', border: '1px solid #e5e5e5',
                  borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  zIndex: 200, fontFamily: 'Inter,sans-serif',
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>Notifications</span>
                    <span style={{ fontSize: 10, color: '#a3a3a3', background: '#f5f5f5', padding: '2px 7px', borderRadius: 5, fontWeight: 500 }}>0 nouvelle</span>
                  </div>
                  <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <Bell size={24} color="#e5e5e5" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 12.5, color: '#a3a3a3' }}>Aucune notification</p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar + menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={e => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '4px 8px 4px 4px', borderRadius: 10,
                  border: '1px solid #e5e5e5', background: '#fff',
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#d4d4d4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#667eea,#764ba2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initiale}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                  {user?.full_name?.split(' ')[0]}
                </span>
                <ChevronDown size={12} color="#a3a3a3" />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                  width: 220, background: '#fff', border: '1px solid #e5e5e5',
                  borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  zIndex: 200, overflow: 'hidden', fontFamily: 'Inter,sans-serif',
                }}>
                  {/* Info user */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initiale}</div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>{user?.full_name}</div>
                        <div style={{ fontSize: 11, color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{user?.email}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, border: '1px solid #e5e5e5', background: '#fafafa', fontSize: 11, fontWeight: 500, color: '#525252' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isAdmin ? '#ef4444' : isChefDept ? '#a855f7' : '#3b82f6' }} />
                      {isAdmin ? 'Administrateur' : isChefDept ? 'Chef de département' : 'Employé'}
                    </div>
                  </div>

                  <div style={{ padding: '6px 8px' }}>
                    {[
                      { icon: Users, label: 'Mon profil', onClick: () => { navigate('/parametre'); setShowUserMenu(false); } },
                      { icon: Settings, label: 'Paramètres', onClick: () => { navigate('/parametre'); setShowUserMenu(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#525252', fontFamily: 'Inter,sans-serif', textAlign: 'left', transition: 'background .1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <item.icon size={14} color="#a3a3a3" />{item.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: '0 8px 8px', borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ height: 6 }} />
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#ef4444', fontFamily: 'Inter,sans-serif', fontWeight: 500, textAlign: 'left', transition: 'background .1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={14} color="#ef4444" />Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════════════
            CORPS — sidebar gauche + contenu principal
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Sidebar gauche — minimaliste, condensé */}
          <aside style={{
            width: 190, flexShrink: 0, background: '#fff',
            borderRight: '1px solid #e5e5e5',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto', padding: '16px 10px',
            fontFamily: 'Inter,sans-serif',
          }}>
            {/* Nom entreprise */}
            <div style={{ padding: '10px 10px 14px', borderBottom: '1px solid #f0f0f0', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {orgName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{orgName}</div>
                  <div style={{ fontSize: 10, color: '#a3a3a3', marginTop: 1 }}>{organization?.industry || 'Entreprise'}</div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {sidebar.map((section) => (
              <div key={section.section} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 10px', marginBottom: 6 }}>
                  {section.section}
                </div>
                {section.items.map((item) => {
                  const active = isSidebarActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link key={item.label + item.path} to={item.path} style={{ textDecoration: 'none', display: 'block', marginBottom: 1 }}>
                      <div
                        className="cs-sitem"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 10px', borderRadius: 8,
                          background: active ? '#f0f0f0' : 'transparent',
                          transition: 'background .12s', cursor: 'pointer',
                        }}
                      >
                        {item.dot ? (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, flexShrink: 0, marginLeft: 2 }} />
                        ) : Icon ? (
                          <Icon size={14} color={active ? '#171717' : '#a3a3a3'} strokeWidth={active ? 2 : 1.8} />
                        ) : null}
                        <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? '#171717' : '#525252', flex: 1 }}>
                          {item.label}
                        </span>
                        {item.badge != null && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#525252', background: '#f0f0f0', padding: '1px 6px', borderRadius: 5 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Déconnexion en bas */}
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: 13, color: '#a3a3a3', fontFamily: 'Inter,sans-serif',
                  transition: 'all .12s', textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; }}
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
            </div>
          </aside>

          {/* Contenu principal */}
          <main style={{ flex: 1, overflowY: 'auto', background: '#f8f8f8' }}>
            {children}
          </main>
        </div>
      </div>

      {/* Modal invitation */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </>
  );
}