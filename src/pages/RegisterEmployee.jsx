import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Mail, Lock, Eye, EyeOff,
    ArrowRight, AlertCircle, CheckCircle,
    User, Briefcase, Phone, ChevronLeft, Loader
} from 'lucide-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

export default function RegisterEmployee() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { _saveSession } = useAuth();

    const token = searchParams.get('token');

    const [invitation, setInvitation] = useState(null);
    const [invError, setInvError] = useState('');
    const [loadingInv, setLoadingInv] = useState(true);

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        position: '',
        department: '',
        password: '',
        confirm_password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // ── Vérifier le token au chargement ────────────────────────────────────────
    useEffect(() => {
        if (!token) {
            setInvError('Lien d\'invitation invalide ou manquant.');
            setLoadingInv(false);
            return;
        }

        axios.get(`${API_URL}/invite/${token}`)
            .then(res => {
                setInvitation(res.data);
                setFormData(prev => ({
                    ...prev,
                    position: res.data.position || '',
                    department: res.data.department || '',
                }));
            })
            .catch(err => {
                setInvError(
                    err.response?.data?.error || 'Invitation invalide ou expirée.'
                );
            })
            .finally(() => setLoadingInv(false));
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register-employee`, {
                invite_token: token,
                full_name: formData.full_name,
                phone: formData.phone,
                position: formData.position,
                department: formData.department,
                password: formData.password,
            });

            const { token: newToken, user: newUser } = response.data;

            // Sauvegarder la session
            localStorage.setItem('authToken', newToken);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            setError(
                err.response?.data?.error || 'Erreur lors de l\'inscription. Réessayez.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Styles ─────────────────────────────────────────────────────────────────
    const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #171717; -webkit-font-smoothing: antialiased; }
    .input-field {
      width: 100%; padding: 0 14px; height: 42px; border-radius: 10px;
      border: 1px solid #e5e5e5; background: #fff; font-size: 14px;
      color: #171717; font-family: 'Inter', sans-serif; transition: all .15s; outline: none;
    }
    .input-field:focus { border-color: #171717; }
    .input-field::placeholder { color: #a3a3a3; }
    .btn-primary {
      width: 100%; height: 44px; border-radius: 10px;
      background: #171717; color: #fff; font-size: 14px; font-weight: 500;
      font-family: 'Inter', sans-serif; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .15s;
    }
    .btn-primary:hover { background: #262626; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `;

    const label = (text) => (
        <label style={{
            display: 'block', fontSize: 13, fontWeight: 500,
            color: '#525252', marginBottom: 8
        }}>{text}</label>
    );

    const inputWithIcon = (icon, name, type, placeholder, extra = {}) => (
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#a3a3a3', display: 'flex'
            }}>
                {icon}
            </div>
            <input
                type={type} name={name} value={formData[name]}
                onChange={handleChange} placeholder={placeholder}
                className="input-field" style={{ paddingLeft: 42, ...extra }}
            />
        </div>
    );

    // ── Loading invitation ─────────────────────────────────────────────────────
    if (loadingInv) {
        return (
            <>
                <style>{styles}</style>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Loader size={32} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: 16, color: '#737373' }}>Vérification de l'invitation...</p>
                    </div>
                </div>
            </>
        );
    }

    // ── Invitation invalide ────────────────────────────────────────────────────
    if (invError) {
        return (
            <>
                <style>{styles}</style>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ textAlign: 'center', maxWidth: 400 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: '#fef2f2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                        }}>
                            <AlertCircle size={32} color="#dc2626" />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 8 }}>
                            Invitation invalide
                        </h2>
                        <p style={{ color: '#737373', fontSize: 14, marginBottom: 24 }}>{invError}</p>
                        <Link to="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            color: '#667eea', textDecoration: 'none', fontSize: 14, fontWeight: 500
                        }}>
                            <ChevronLeft size={16} /> Retour à la connexion
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // ── Succès ─────────────────────────────────────────────────────────────────
    if (success) {
        return (
            <>
                <style>{styles}</style>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ textAlign: 'center', maxWidth: 400 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                        }}>
                            <CheckCircle size={32} color="#16a34a" />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#171717', marginBottom: 8 }}>
                            Compte créé !
                        </h2>
                        <p style={{ color: '#737373', fontSize: 14 }}>
                            Redirection vers votre tableau de bord...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ── Formulaire ─────────────────────────────────────────────────────────────
    return (
        <>
            <style>{styles}</style>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #e5e5e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, background: '#171717', borderRadius: 7,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 size={14} color="#fff" strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 650, color: '#171717', letterSpacing: '-0.02em' }}>
                            CommSight
                        </span>
                    </div>
                    <Link to="/login" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        color: '#525252', textDecoration: 'none', fontSize: 13
                    }}>
                        <ChevronLeft size={14} /> Se connecter
                    </Link>
                </div>

                {/* Main */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', padding: '40px 24px'
                }}>
                    <div style={{ width: '100%', maxWidth: 480 }}>

                        {/* Bannière invitation */}
                        <div style={{
                            marginBottom: 32, padding: 16, background: '#f0f9ff',
                            border: '1px solid #bae6fd', borderRadius: 12,
                            display: 'flex', alignItems: 'center', gap: 12
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', background: '#0ea5e9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Building2 size={18} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#0c4a6e' }}>
                                    Invitation de {invitation?.invited_by_name}
                                </p>
                                <p style={{ fontSize: 12, color: '#0369a1', marginTop: 2 }}>
                                    Rejoindre <strong>{invitation?.organization_name}</strong>
                                    {invitation?.department && ` · ${invitation.department}`}
                                </p>
                            </div>
                        </div>

                        {/* Titre */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <h1 style={{
                                fontSize: 28, fontWeight: 700, color: '#171717',
                                letterSpacing: '-0.03em', marginBottom: 8
                            }}>
                                Créer votre compte
                            </h1>
                            <p style={{ fontSize: 14, color: '#737373' }}>
                                Connecté à <strong>{invitation?.email}</strong>
                            </p>
                        </div>

                        {/* Erreur */}
                        {error && (
                            <div style={{
                                marginBottom: 24, padding: 14, background: '#fef2f2',
                                border: '1px solid #fecaca', borderRadius: 10,
                                display: 'flex', alignItems: 'start', gap: 10
                            }}>
                                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>{error}</span>
                            </div>
                        )}

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Nom complet */}
                                <div>
                                    {label('Nom complet *')}
                                    {inputWithIcon(<User size={16} />, 'full_name', 'text', 'Ex: Ahmed Benali')}
                                </div>

                                {/* Téléphone */}
                                <div>
                                    {label('Téléphone')}
                                    {inputWithIcon(<Phone size={16} />, 'phone', 'tel', '+213 XXX XXX XXX')}
                                </div>

                                {/* Poste + Département */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        {label('Poste')}
                                        {inputWithIcon(<Briefcase size={16} />, 'position', 'text', 'Ex: Développeur')}
                                    </div>
                                    <div>
                                        {label('Département')}
                                        <input
                                            type="text" name="department" value={formData.department}
                                            onChange={handleChange} placeholder="Ex: IT"
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    {label('Mot de passe *')}
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color="#a3a3a3" style={{
                                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)'
                                        }} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password" value={formData.password}
                                            onChange={handleChange} placeholder="Minimum 6 caractères"
                                            className="input-field" style={{ paddingLeft: 42, paddingRight: 42 }}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: 14, top: '50%',
                                                transform: 'translateY(-50%)', background: 'none',
                                                border: 'none', cursor: 'pointer', padding: 0,
                                                display: 'flex', alignItems: 'center'
                                            }}>
                                            {showPassword ? <EyeOff size={16} color="#a3a3a3" /> : <Eye size={16} color="#a3a3a3" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmer mot de passe */}
                                <div>
                                    {label('Confirmer le mot de passe *')}
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color="#a3a3a3" style={{
                                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)'
                                        }} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirm_password" value={formData.confirm_password}
                                            onChange={handleChange} placeholder="Retapez votre mot de passe"
                                            className="input-field" style={{ paddingLeft: 42 }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Bouton */}
                                <button type="submit" disabled={loading} className="btn-primary"
                                    style={{ marginTop: 8 }}>
                                    {loading ? 'Création du compte...' : (
                                        <> Rejoindre {invitation?.organization_name} <ArrowRight size={16} /> </>
                                    )}
                                </button>

                            </div>
                        </form>

                        {/* Login link */}
                        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#737373' }}>
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login" style={{ color: '#667eea', fontWeight: 500, textDecoration: 'none' }}>
                                Se connecter
                            </Link>
                        </p>

                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 24px', borderTop: '1px solid #e5e5e5', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#a3a3a3' }}>© 2026 CommSight. Tous droits réservés.</p>
                </div>

            </div>
        </>
    );
}