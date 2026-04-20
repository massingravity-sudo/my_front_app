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
  CheckCircle,
  ChevronLeft,
  User,
  Briefcase,
  Phone,
  MapPin
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    organization_name: '',
    organization_industry: '',
    organization_size: '',
    organization_country: 'Algérie',
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    position: '',
    department: ''
  });

  const industries = [
    'Technologie',
    'Finance',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie',
    'Services',
    'Agriculture',
    'Transport',
    'Autre'
  ];

  const organizationSizes = [
    '1-10 employés',
    '11-50 employés',
    '51-200 employés',
    '201-500 employés',
    '500+ employés'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleNextStep = () => {
    if (!formData.organization_name || !formData.organization_industry || !formData.organization_size) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setStep(2);
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
      const result = await register(formData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
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
        select.input-field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a3a3a3' d='M6 9L1 4h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        .btn-primary {
          width: 100%; height: 44px; border-radius: 10px;
          background: #171717; color: #fff; font-size: 14px; font-weight: 500;
          font-family: 'Inter', sans-serif; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s;
        }
        .btn-primary:hover { background: #262626; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary {
          width: 100%; height: 44px; border-radius: 10px;
          background: #fff; color: #171717; font-size: 14px; font-weight: 500;
          font-family: 'Inter', sans-serif; border: 1px solid #e5e5e5; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s;
        }
        .btn-secondary:hover { background: #fafafa; border-color: #d4d4d4; }
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
          <div style={{ width: '100%', maxWidth: 520 }}>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#171717',
                letterSpacing: '-0.03em',
                marginBottom: 8
              }}>
                Créer votre compte
              </h1>
              <p style={{
                fontSize: 14,
                color: '#737373',
                letterSpacing: '-0.01em'
              }}>
                {step === 1 ? 'Commencez par les informations de votre organisation' : 'Créez votre compte administrateur'}
              </p>
            </div>

            {/* Step Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 32
            }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #e5e5e5',
                background: step === 1 ? '#171717' : '#fafafa',
                color: step === 1 ? '#fff' : '#a3a3a3',
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <Building2 size={12} />
                Organisation
              </div>
              <div style={{ width: 24, height: 1, background: '#e5e5e5' }} />
              <div style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #e5e5e5',
                background: step === 2 ? '#171717' : '#fafafa',
                color: step === 2 ? '#fff' : '#a3a3a3',
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <User size={12} />
                Compte Admin
              </div>
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
            <form onSubmit={handleSubmit}>

              {/* STEP 1: Organization */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Organization Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Nom de l'organisation *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building2
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
                        type="text"
                        name="organization_name"
                        required
                        value={formData.organization_name}
                        onChange={handleChange}
                        placeholder="Ex: Tech Solutions SARL"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Secteur d'activité *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase
                        size={16}
                        color="#a3a3a3"
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none'
                        }}
                      />
                      <select
                        name="organization_industry"
                        required
                        value={formData.organization_industry}
                        onChange={handleChange}
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      >
                        <option value="">Sélectionnez un secteur</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Taille de l'entreprise *
                    </label>
                    <select
                      name="organization_size"
                      required
                      value={formData.organization_size}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Sélectionnez la taille</option>
                      {organizationSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Pays
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin
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
                        type="text"
                        name="organization_country"
                        value={formData.organization_country}
                        onChange={handleChange}
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary"
                    style={{ marginTop: 8 }}
                  >
                    Continuer
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 2: User Account */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Full Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Nom complet *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User
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
                        type="text"
                        name="full_name"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Ex: Ahmed Benali"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Email professionnel *
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
                        placeholder="admin@entreprise.com"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Téléphone
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone
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
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+213 XXX XXX XXX"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Poste *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase
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
                        type="text"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="Ex: Directeur Général"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Département
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Ex: Direction"
                      className="input-field"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Mot de passe *
                    </label>
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
                        placeholder="Minimum 6 caractères"
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

                  {/* Confirm Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#525252',
                      marginBottom: 8
                    }}>
                      Confirmer le mot de passe *
                    </label>
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
                        name="confirm_password"
                        required
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Retapez votre mot de passe"
                        className="input-field"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginTop: 8
                  }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Login Link */}
            <div style={{
              marginTop: 24,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: 13, color: '#737373' }}>
                Vous avez déjà un compte ?{' '}
              </span>
              <Link to="/login" className="link-text" style={{ fontWeight: 500 }}>
                Se connecter
              </Link>
            </div>
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