import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell, User, LogOut, Settings, ChevronDown,
  Briefcase, Shield, Crown, UserPlus, X,
  Mail, CheckCircle, Copy, AlertCircle, Building2,
  Users, Trash2, Send, Clock, XCircle, RefreshCw,
  Download, Upload
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
   MODAL INVITATION SIMPLE
══════════════════════════════════════════════════════════════════════════════ */
function InviteModal({ onClose, onSuccess }) {
  const { orgName } = useAuth();

  const [formData, setFormData] = useState({
    email: '', full_name: '', role: 'employee', department: '', position: '',
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
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/invite`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(res.data);
      if (onSuccess) onSuccess();
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
      <InviteModalStyles />
      <div className="modal-over" onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div className="modal-box" onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: 460, background: '#fff',
          borderRadius: 16, border: '1px solid #e5e5e5',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          fontFamily: 'Inter,sans-serif', overflow: 'hidden',
        }}>

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
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e5e5',
              background: '#fafafa', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              <X size={14} color="#737373" />
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px' }}>
            {success ? (
              /* Succès */
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

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="inv-btn-secondary"
                    onClick={() => {
                      setSuccess(null);
                      setFormData({ email: '', full_name: '', role: 'employee', department: '', position: '' });
                    }}
                  >
                    Inviter un autre
                  </button>
                  <button style={{
                    flex: 1, height: 38, borderRadius: 9,
                    background: '#171717', border: '1px solid #171717',
                    color: '#fff', fontSize: 13.5, fontWeight: 500,
                    fontFamily: 'Inter,sans-serif', cursor: 'pointer',
                  }} onClick={onClose}>
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire */
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

                  {/* Nom complet */}
                  <div>
                    <label className="inv-label">Nom complet *</label>
                    <input type="text" required className="inv-input"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Ex: Ahmed Benali"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="inv-label">Email *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={14} color="#a3a3a3" style={{
                        position: 'absolute', left: 12, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none',
                      }} />
                      <input type="email" required className="inv-input"
                        style={{ paddingLeft: 34 }}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="employe@entreprise.com"
                      />
                    </div>
                  </div>

                  {/* Département + Poste */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label className="inv-label">Département</label>
                      <input type="text" className="inv-input"
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Ex: IT"
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
   MODAL INVITATION MULTIPLE
══════════════════════════════════════════════════════════════════════════════ */
function BulkInviteModal({ onClose, onSuccess }) {
  const { orgName } = useAuth();

  const [employees, setEmployees] = useState([
    { email: '', full_name: '', department: '', position: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const addEmployee = () => {
    setEmployees([...employees, { email: '', full_name: '', department: '', position: '' }]);
  };

  const removeEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const updateEmployee = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/invite/bulk`,
        { employees },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InviteModalStyles />
      <div className="modal-over" onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div className="modal-box" onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: 680, background: '#fff',
          borderRadius: 16, border: '1px solid #e5e5e5',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          fontFamily: 'Inter,sans-serif', overflow: 'hidden',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}>

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
                <Users size={16} color="#525252" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                  Inviter plusieurs employés
                </div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 1 }}>{employees.length} employé(s)</div>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e5e5',
              background: '#fafafa', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={14} color="#737373" />
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
            {result ? (
              /* Résultat */
              <div>
                <div style={{
                  padding: '20px', borderRadius: 12,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  marginBottom: 20,
                }}>
                  <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d', textAlign: 'center' }}>
                    {result.invited?.length || 0} invitation(s) envoyée(s) !
                  </div>
                </div>

                {result.failed && result.failed.length > 0 && (
                  <div style={{
                    padding: '12px', borderRadius: 9,
                    background: '#fef2f2', border: '1px solid #fecaca',
                    marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#991b1b', marginBottom: 8 }}>
                      {result.failed.length} échec(s) :
                    </div>
                    {result.failed.map((f, i) => (
                      <div key={i} style={{ fontSize: 11.5, color: '#991b1b', marginTop: 4 }}>
                        • {f.email} : {f.reason}
                      </div>
                    ))}
                  </div>
                )}

                <button style={{
                  width: '100%', height: 40, borderRadius: 9,
                  background: '#171717', color: '#fff', fontSize: 13.5,
                  fontWeight: 500, border: 'none', cursor: 'pointer',
                }} onClick={onClose}>
                  Fermer
                </button>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    marginBottom: 16, padding: '10px 12px', borderRadius: 9,
                    background: '#fef2f2', border: '1px solid #fecaca',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertCircle size={14} color="#dc2626" />
                    <span style={{ fontSize: 12.5, color: '#991b1b' }}>{error}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {employees.map((emp, index) => (
                    <div key={index} style={{
                      padding: 16, borderRadius: 10,
                      border: '1px solid #e5e5e5', background: '#fafafa',
                      position: 'relative',
                    }}>
                      {employees.length > 1 && (
                        <button type="button" onClick={() => removeEmployee(index)} style={{
                          position: 'absolute', top: 10, right: 10,
                          width: 24, height: 24, borderRadius: 6,
                          border: '1px solid #fecaca', background: '#fef2f2',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Trash2 size={12} color="#dc2626" />
                        </button>
                      )}

                      <div style={{ fontSize: 11, fontWeight: 600, color: '#a3a3a3', marginBottom: 10 }}>
                        EMPLOYÉ #{index + 1}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <input type="text" required className="inv-input"
                          placeholder="Nom complet *"
                          value={emp.full_name}
                          onChange={e => updateEmployee(index, 'full_name', e.target.value)}
                        />
                        <input type="email" required className="inv-input"
                          placeholder="Email *"
                          value={emp.email}
                          onChange={e => updateEmployee(index, 'email', e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <input type="text" className="inv-input"
                          placeholder="Département"
                          value={emp.department}
                          onChange={e => updateEmployee(index, 'department', e.target.value)}
                        />
                        <input type="text" className="inv-input"
                          placeholder="Poste"
                          value={emp.position}
                          onChange={e => updateEmployee(index, 'position', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addEmployee} style={{
                    width: '100%', height: 38, borderRadius: 9,
                    border: '1px dashed #d4d4d4', background: '#fafafa',
                    color: '#525252', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <UserPlus size={14} />
                    Ajouter un employé
                  </button>

                  <button type="submit" className="inv-btn-primary" disabled={loading}>
                    {loading ? 'Envoi...' : `Envoyer ${employees.length} invitation(s)`}
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
   MODAL LISTE DES INVITATIONS EN ATTENTE
══════════════════════════════════════════════════════════════════════════════ */
function PendingInvitationsModal({ onClose }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitations(res.data);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/invitations/${id}/resend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Invitation renvoyée !');
    } catch (err) {
      alert('Erreur lors du renvoi');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Annuler cette invitation ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/invitations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadInvitations();
    } catch (err) {
      alert('Erreur lors de l\'annulation');
    }
  };

  return (
    <>
      <InviteModalStyles />
      <div className="modal-over" onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div className="modal-box" onClick={e => e.stopPropagation()} style={{
          width: '100%', maxWidth: 600, background: '#fff',
          borderRadius: 16, border: '1px solid #e5e5e5',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          fontFamily: 'Inter,sans-serif', overflow: 'hidden',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}>

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
                <Clock size={16} color="#525252" strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>
                  Invitations en attente
                </div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 1 }}>
                  {invitations.length} en attente
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid #e5e5e5',
              background: '#fafafa', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={14} color="#737373" />
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 13, color: '#a3a3a3' }}>Chargement...</div>
              </div>
            ) : error ? (
              <div style={{
                padding: '12px', borderRadius: 9,
                background: '#fef2f2', border: '1px solid #fecaca',
                fontSize: 12.5, color: '#991b1b',
              }}>
                {error}
              </div>
            ) : invitations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Clock size={32} color="#e5e5e5" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: 13, color: '#a3a3a3' }}>Aucune invitation en attente</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {invitations.map((inv) => (
                  <div key={inv.id} style={{
                    padding: 14, borderRadius: 10,
                    border: '1px solid #e5e5e5', background: '#fafafa',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>
                        {inv.full_name || 'Sans nom'}
                      </div>
                      <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>
                        {inv.email}
                      </div>
                      <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4 }}>
                        {inv.department && `${inv.department} • `}
                        {inv.position || 'Employé'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleResend(inv.id)} style={{
                        width: 32, height: 32, borderRadius: 7,
                        border: '1px solid #dbeafe', background: '#eff6ff',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }} title="Renvoyer">
                        <RefreshCw size={14} color="#3b82f6" />
                      </button>
                      <button onClick={() => handleCancel(inv.id)} style={{
                        width: 32, height: 32, borderRadius: 7,
                        border: '1px solid #fecaca', background: '#fef2f2',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }} title="Annuler">
                        <XCircle size={14} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STYLES COMMUNS
══════════════════════════════════════════════════════════════════════════════ */
function InviteModalStyles() {
  return (
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
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TOPBAR PRINCIPAL
══════════════════════════════════════════════════════════════════════════════ */
export default function Topbar() {
  const { user, logout, isAdmin, isChefDept, orgName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

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

  useEffect(() => {
    const close = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
      setShowInviteMenu(false);
    };
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

  const refreshInvitations = () => {
    // Callback pour rafraîchir la liste si nécessaire
  };

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
          display:flex; align-items:center; justify-content:center;
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

      <div style={{
        height: 60, background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, fontFamily: 'Inter, sans-serif',
      }}>

        {/* Gauche */}
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

        {/* Droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Menu Inviter (Admin) */}
          {isAdmin && (
            <div style={{ position: 'relative' }}>
              <button
                className="tb-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInviteMenu(!showInviteMenu);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                style={{
                  background: '#171717', color: '#fff',
                  border: '1px solid #171717',
                }}
              >
                <UserPlus size={14} strokeWidth={1.8} />
                <span>Inviter</span>
                <ChevronDown size={12} />
              </button>

              {showInviteMenu && (
                <div className="tb-menu" onClick={e => e.stopPropagation()} style={{ width: 200 }}>
                  <button className="tb-menu-item" style={{ borderRadius: '8px 8px 0 0' }}
                    onClick={() => { setShowInviteModal(true); setShowInviteMenu(false); }}>
                    <UserPlus size={14} color="#525252" />
                    <span>Un employé</span>
                  </button>
                  <button className="tb-menu-item"
                    onClick={() => { setShowBulkInviteModal(true); setShowInviteMenu(false); }}>
                    <Users size={14} color="#525252" />
                    <span>Plusieurs employés</span>
                  </button>
                  <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
                  <button className="tb-menu-item" style={{ borderRadius: '0 0 8px 8px' }}
                    onClick={() => { setShowPendingModal(true); setShowInviteMenu(false); }}>
                    <Clock size={14} color="#525252" />
                    <span>En attente</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Switch mode (Chef) */}
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
              onClick={e => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                setShowInviteMenu(false);
              }}
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
              onClick={e => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowInviteMenu(false);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 6px', borderRadius: 10,
                border: '1px solid #e5e5e5', background: '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
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

                {isChefDept && !isAdmin && (
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

      {/* Modales */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={refreshInvitations}
        />
      )}
      {showBulkInviteModal && (
        <BulkInviteModal
          onClose={() => setShowBulkInviteModal(false)}
          onSuccess={refreshInvitations}
        />
      )}
      {showPendingModal && (
        <PendingInvitationsModal onClose={() => setShowPendingModal(false)} />
      )}
    </>
  );
}