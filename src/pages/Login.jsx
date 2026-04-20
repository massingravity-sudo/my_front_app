import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    ChevronLeft
} from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fff; color: #171717;
          -webkit-font-smoothing: antialiased;
        }
        .input-field {
          width: 100%; padding: 0 14px; height: 42px; border-radius: 10px;
          border: 1px solid #e5e5e5; background: #fff; font-size: 14px;
          color: #171717; font-family: 'Inter', sans-serif;
          transition: all .15s; outline: none;
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
        .link-text {
          color: #525252; text-decoration: none; font-size: 13px;
          transition: color .15s;
        }
        .link-text:hover { color: #171717; }
      `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            width: 28,
                            height: 28,
                            background: '#171717',
                            borderRadius: 7,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Building2 size={14} color="#fff" strokeWidth={2} />
                        </div>
                        <span style={{
                            fontSize: 15,
                            fontWeight: 650,
                            color: '#171717',
                            letterSpacing: '-0.02em'
                        }}>
                            CommSight
                        </span>
                    </Link>

                    <Link to="/" className="link-text" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <ChevronLeft size={14} />
                        Retour à l'accueil
                    </Link>
                </div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px'
                }}>
                    <div style={{ width: '100%', maxWidth: 420 }}>

                        {/* Title */}
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <h1 style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#171717',
                                letterSpacing: '-0.03em',
                                marginBottom: 8
                            }}>
                                Connexion
                            </h1>
                            <p style={{
                                fontSize: 14,
                                color: '#737373',
                                letterSpacing: '-0.01em'
                            }}>
                                Accédez à votre espace de travail
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                marginBottom: 24,
                                padding: 14,
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'start',
                                gap: 10
                            }}>
                                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>

                            {/* Email */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: '#525252',
                                    marginBottom: 8,
                                    letterSpacing: '-0.01em'
                                }}>
                                    Email
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail
                                        size={16}
                                        color="#a3a3a3"
                                        style={{
                                            position: 'absolute',
                                            left: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="votre.email@entreprise.com"
                                        className="input-field"
                                        style={{ paddingLeft: 42 }}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 8
                                }}>
                                    <label style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#525252',
                                        letterSpacing: '-0.01em'
                                    }}>
                                        Mot de passe
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="link-text"
                                        style={{ fontSize: 12 }}
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock
                                        size={16}
                                        color="#a3a3a3"
                                        style={{
                                            position: 'absolute',
                                            left: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="input-field"
                                        style={{ paddingLeft: 42, paddingRight: 42 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} color="#a3a3a3" />
                                        ) : (
                                            <Eye size={16} color="#a3a3a3" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    'Connexion en cours...'
                                ) : (
                                    <>
                                        Se connecter
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Separator */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 24
                        }}>
                            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
                            <span style={{ fontSize: 12, color: '#a3a3a3' }}>
                                Nouveau sur CommSight ?
                            </span>
                            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }} />
                        </div>

                        {/* Register Link */}
                        <Link
                            to="/register"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 44,
                                borderRadius: 10,
                                border: '1px solid #e5e5e5',
                                background: '#fff',
                                color: '#171717',
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'all .15s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fafafa';
                                e.currentTarget.style.borderColor = '#d4d4d4';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.borderColor = '#e5e5e5';
                            }}
                        >
                            Créer un compte
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 24px',
                    borderTop: '1px solid #e5e5e5',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: 12, color: '#a3a3a3' }}>
                        © 2026 CommSight. Tous droits réservés.
                    </p>
                </div>
            </div>
        </>
    );
}                                                                                       