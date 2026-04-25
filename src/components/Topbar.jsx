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
  '/dashboard': { title: 'Tableau de bord', sub: 'Vue d\'ensemble de votre organisation' },
  '/tasks': { title: 'Tâches', sub: 'Gérez et suivez les tâches' },
  '/messages': { title: 'Messages', sub: 'Communication interne' },
  '/leaves': { title: 'Congés', sub: 'Demandes et suivi des congés' },
  '/posts': { title: 'Actualités', sub: 'Publications internes' },
  '/archives': { title: 'Archives', sub: 'Documents et fichiers' },
  '/surveys': { title: 'Enquêtes', sub: 'Sondages et questionnaires' },
  '/feedbacks': { title: 'Boîte à idées', sub: 'Suggestions et retours' },
  '/feedbacks/admin': { title: 'Feedbacks équipe', sub: 'Retours de votre équipe' },
  '/analytics': { title: 'Analytics', sub: 'Rapports et indicateurs' },
  '/parametre': { title: 'Paramètres', sub: 'Configuration du compte' },
  '/manage-chefs': { title: 'Chefs de département', sub: 'Gestion des managers' },
  '/evaluation': { title: 'Évaluations', sub: 'Évaluation des performances' },
  '/primes': { title: 'Primes', sub: 'Gestion des primes' },
  '/suivi-equipe': { title: 'Suivi équipe', sub: 'Suivi de votre équipe' },
  '/recrutement': { title: 'Recrutement', sub: 'Postes ouverts et candidats' },
};

/* ══════════════════════════════════════════════════════════════════════════════
   MODAL INVITATION — style LandingPage (blanc, Inter, #171717)
══════════════════════════════════════════════════════════════════════════════ */
function InviteModal({ onClose }) {
  const { orgName } = useAuth();

  const [formData, setFormData] = useState({
    email: '', role: 'employee', department: '', position: '',
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
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes modalIn {
          from { opacity:0; transform:translateY(-10px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes spinBtn { to { transform:rotate(360deg); } }
        .modal-box  { animation: modalIn   0.2s ease both; }
        .modal-over { animation: overlayIn 0.15s ease both; }
        .inv-input {
          width:100%; padding:0 12px; height:38px; border-radius:9px;
          border:1px solid #e5e5e5; background:#fff; font-size:13.5px;
          color:#171717; font-family:'Inter',sans-serif;
          transition:border-color 0.15s; outline:none;
        }
        .inv-input:focus { border-color:#171717; }
        .inv-input::placeholder { color:#a3a3a3; }
        .inv-select {
          width:100%; padding:0 12px; height:38px; border-radius:9px;
          border:1px solid #e5e5e5; background:#fff; font-size:13.5px;
          color:#171717; font-family:'Inter',sans-serif; outline:none;
          appearance:none; cursor:pointer; transition:border-color 0.15s;
        }
        .inv-select:focus { border-color:#171717; }
        .inv-label {
          display:block; font-size:12.5px; font-weight:500;
          color:#525252; margin-bottom:6px; font-family:'Inter',sans-serif;
        }
        .inv-btn-primary {
          width:100%; height:40px; border-radius:9px;
          background:#171717; border:1px solid #171717; color:#fff;
          font-size:13.5px; font-weight:500; font-family:'Inter',sans-serif;
          cursor:pointer; display:flex; align-items:center;
          justify-content:center; gap:6px; transition:all 0.15s;
        }
        .inv-btn-primary:hover:not(:disabled) { background:#262626; }
        .inv-btn-primary:disabled { background:#d4d4d4; border-color:#d4d4d4; cursor:not-allowed; }
        .inv-btn-secondary {
          flex:1; height:38px; border-radius:9px;
          background:#fafafa; border:1px solid #e5e5e5; color:#525252;
          font-size:13.5px; font-weight:500; font-family:'Inter',sans-serif;
          cursor:pointer; transition:all 0.15s;
        }
        .inv-btn-secondary:hover { background:#f0f0f0; }
      `}</style>

      <div
        className="modal-over"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
      >
        <div
          className="modal-box"
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 460, background: '#fff',
            borderRadius: 16, border: '1px solid #e5e5e5',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            fontFamily: 'Inter,sans-serif', overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                border: '1px solid #e5e5e5', background: '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <UserPlus size={16} color="#525252" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                  Inviter un employé
                </div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 1 }}>{orgName}</div>
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
            {success ? (
              /* ── Succès ── */
              <div>
                <div style={{
                  padding: '20px', borderRadius: 12,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  textAlign: 'center', marginBottom: 20,
                }}>
                  <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', marginBottom: 4 }}>
                    Invitation envoyée !
                  </div>
                  <div style={{ fontSize: 12.5, color: '#16a34a' }}>
                    Email envoyé à <strong>{formData.email}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#737373', marginBottom: 6, fontWeight: 500 }}>
                    Ou partagez ce lien :
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
                        transition: 'all 0.15s', fontFamily: 'Inter,sans-serif',
                      }}
                    >
                      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="inv-btn-secondary"
                    onClick={() => { setSuccess(null); setFormData({ email: '', role: 'employee', department: '', position: '' }); }}
                  >
                    Inviter un autre
                  </button>
                  <button
                    style={{
                      flex: 1, height: 38, borderRadius: 9,
                      background: '#171717', border: '1px solid #171717',
                      color: '#fff', fontSize: 13.5, fontWeight: 500,
                      fontFamily: 'Inter,sans-serif', cursor: 'pointer',
                    }}
                    onClick={onClose}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* ── Formulaire ── */
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    marginBottom: 16, padding: '10px 12px', borderRadius: 9,
                    background: '#fef2f2', border: '1px solid #fecaca',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: '#991b1b' }}>{error}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Email */}
                  <div>
                    <label className="inv-label">Email de l'employé *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} color="#a3a3a3" style={{
                        position: 'absolute', left: 12, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none',
                      }} />
                      <input
                        type="email" required className="inv-input"
                        style={{ paddingLeft: 34 }}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="employe@entreprise.com"
                      />
                    </div>
                  </div>

                  {/* Rôle */}
                  <div>
                    <label className="inv-label">Rôle</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="inv-select"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="employee">Employé</option>
                        <option value="manager">Manager / Chef de département</option>
                      </select>
                      <ChevronDown size={13} color="#a3a3a3" style={{
                        position: 'absolute', right: 12, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none',
                      }} />
                    </div>
                  </div>

                  {/* Département + Poste */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label className="inv-label">Département</label>
                      <input type="text" className="inv-input"
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Ex: IT, RH..."
                      />
                    </div>
                    <div>
                      <label className="inv-label">Poste</label>
                      <input type="text" className="inv-input"
                        value={formData.position}
                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Ex: Développeur"
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
                      L'employé recevra un email valable <strong>7 jours</strong>, lié automatiquement à <strong>{orgName}</strong>.
                    </span>
                  </div>

                  <button type="submit" className="inv-btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <div style={{
                          width: 13, height: 13, borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          animation: 'spinBtn 0.7s linear infinite',
                        }} />
                        Envoi en cours...
                      </>
                    ) : (
                      <><UserPlus size={14} /> Envoyer l'invitation</>
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

/* ══════════════════════════════════════════════════════════════════════════════
   TOPBAR PRINCIPAL — style LandingPage (blanc propre)
══════════════════════════════════════════════════════════════════════════════ */
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

  // Ferme les menus au clic extérieur
  useEffect(() => {
    const close = () => { setShowUserMenu(false); setShowNotifications(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleSwitchMode = () => {
    const m = userMode === 'employee' ? 'chef' : 'employee';
    setUserMode(m);
    localStorage.setItem('userMode', m);
    window.dispatchEvent(new Event('modeChanged'));
    navigate(m === 'chef' ? '/hr' : '/dashboard');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'CommSight', sub: '' };
  const initiale = user?.full_name?.charAt(0)?.toUpperCase() || '?';

  const roleLabel = isAdmin ? 'Administrateur'
    : isChefDept && userMode === 'chef' ? `Chef · ${user?.department || 'Département'}`
      : 'Employé';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .tb-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:0 14px; height:36px; border-radius:9px;
          font-size:13px; font-weight:500; font-family:'Inter',sans-serif;
          cursor:pointer; transition:all 0.15s; letter-spacing:-0.01em; border:none;
        }
        .tb-icon-btn {
          width:36px; height:36px; border-radius:9px; border:none;
          display:flex; align-items:center; justifycontent:center;
          cursor:pointer; transition:all 0.15s; background:transparent;
          position:relative;
        }
        .tb-icon-btn:hover { background:#f5f5f5; }
        .tb-menu {
          position:absolute; right:0; top:calc(100% + 8px);
          width:220px; background:#fff; border:1px solid #e5e5e5;
          border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.1);
          z-index:100; overflow:hidden;
          font-family:'Inter',sans-serif;
        }
        .tb-menu-item {
          display:flex; align-items:center; gap:8px;
          padding:9px 14px; cursor:pointer; transition:background 0.1s;
          font-size:13px; color:#525252; border:none; background:transparent;
          width:100%; text-align:left; font-family:'Inter',sans-serif;
        }
        .tb-menu-item:hover { background:#fafafa; }
      `}</style>

      {/* Topbar — fond blanc, bordure bas légère, style LandingPage */}
      <div style={{
        height: 60, background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, fontFamily: 'Inter, sans-serif',
      }}>

        {/* Gauche — titre page */}
        <div>
          <h2 style={{
            fontSize: 15, fontWeight: 600, color: '#171717',
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            {pageInfo.title}
          </h2>
          <p style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 3, letterSpacing: '-0.01em' }}>
            {orgName} · {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Droite — actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Bouton Inviter — Admin uniquement */}
          {isAdmin && (
            <button
              className="tb-btn"
              onClick={() => setShowInviteModal(true)}
              style={{
                background: '#171717', color: '#fff',
                border: '1px solid #171717',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#262626'}
              onMouseLeave={e => e.currentTarget.style.background = '#171717'}
            >
              <UserPlus size={14} strokeWidth={1.8} />
              <span>Inviter un employé</span>
            </button>
          )}

          {/* Switch mode — Chef */}
          {isChefDept && !isAdmin && (
            <button
              className="tb-btn"
              onClick={handleSwitchMode}
              style={{
                background: userMode === 'chef' ? '#f5f3ff' : '#f0fdf4',
                color: userMode === 'chef' ? '#7c3aed' : '#16a34a',
                border: `1px solid ${userMode === 'chef' ? '#ddd6fe' : '#bbf7d0'}`,
              }}
            >
              {userMode === 'chef'
                ? <><Briefcase size={13} /><span>Mode Employé</span></>
                : <><Shield size={13} /><span>Mode Chef</span></>}
            </button>
          )}

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              className="tb-icon-btn"
              onClick={e => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bell size={17} color="#737373" strokeWidth={1.8} />
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: '#ef4444', border: '1.5px solid #fff',
              }} />
            </button>

            {showNotifications && (
              <div className="tb-menu" onClick={e => e.stopPropagation()}>
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>Notifications</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#737373',
                    background: '#f5f5f5', padding: '2px 7px', borderRadius: 5,
                  }}>0 nouvelle</span>
                </div>
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <Bell size={28} color="#e5e5e5" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: 12.5, color: '#a3a3a3' }}>Aucune notification</p>
                </div>
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div style={{ width: 1, height: 22, background: '#e5e5e5', margin: '0 2px' }} />

          {/* Menu utilisateur */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 6px', borderRadius: 10,
                border: '1px solid #e5e5e5', background: '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#d4d4d4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
            >
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>
                {initiale}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#171717', lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {user?.full_name?.split(' ')[0]}
                </div>
                <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 2 }}>
                  {roleLabel}
                </div>
              </div>
              <ChevronDown size={13} color="#a3a3a3" />
            </button>

            {showUserMenu && (
              <div className="tb-menu" onClick={e => e.stopPropagation()}>

                {/* Info utilisateur */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#fff',
                    }}>
                      {initiale}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                        {user?.full_name}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  {/* Badge rôle */}
                  <div style={{
                    marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px', borderRadius: 20,
                    border: '1px solid #e5e5e5', background: '#fafafa',
                    fontSize: 11, fontWeight: 500, color: '#525252',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: isAdmin ? '#ef4444' : isChefDept ? '#a855f7' : '#3b82f6',
                    }} />
                    {isAdmin ? 'Administrateur' : isChefDept ? 'Chef de département' : 'Employé'}
                  </div>
                </div>

                {/* Switch mode chef */}
                {isChefDept && !isAdmin && (
                  <>
                    <div style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>
                      <button
                        className="tb-menu-item"
                        style={{
                          borderRadius: 8,
                          background: userMode === 'chef' ? '#f0fdf4' : '#f5f3ff',
                          color: userMode === 'chef' ? '#16a34a' : '#7c3aed',
                          fontWeight: 600,
                        }}
                        onClick={() => { handleSwitchMode(); setShowUserMenu(false); }}
                      >
                        {userMode === 'chef'
                          ? <><Briefcase size={13} /> Passer en mode Employé</>
                          : <><Crown size={13} /> Passer en mode Chef</>}
                      </button>
                    </div>
                  </>
                )}

                <div style={{ padding: '6px 8px' }}>
                  <button className="tb-menu-item" style={{ borderRadius: 8 }}
                    onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}>
                    <User size={14} color="#a3a3a3" />
                    <span>Mon profil</span>
                  </button>
                  <button className="tb-menu-item" style={{ borderRadius: 8 }}
                    onClick={() => { navigate('/parametre'); setShowUserMenu(false); }}>
                    <Settings size={14} color="#a3a3a3" />
                    <span>Paramètres</span>
                  </button>
                </div>

                <div style={{ padding: '0 8px 8px', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ height: 6 }} />
                  <button
                    className="tb-menu-item"
                    style={{ borderRadius: 8, color: '#ef4444', fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} color="#ef4444" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal invitation */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
    </>
  );
}