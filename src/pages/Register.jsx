import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAdvancedAPI } from '../services/api';
import { Mail, Lock, User, Briefcase, Building2, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    department: '',
    position: '',
    phone: ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-slate-400'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    const map = [
      { msg: 'Très faible', color: 'text-red-400' },
      { msg: 'Faible', color: 'text-orange-400' },
      { msg: 'Faible', color: 'text-orange-400' },
      { msg: 'Moyen', color: 'text-yellow-400' },
      { msg: 'Fort', color: 'text-blue-400' },
      { msg: 'Très fort', color: 'text-green-400' },
    ];
    const { msg: message, color } = map[score] || map[0];
    setPasswordStrength({ score, message, color });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordStrength(e.target.value);
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await authAdvancedAPI.registerRequest(formData);
      setSuccess(r.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi du code");
    } finally { setLoading(false); }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    if (passwordStrength.score < 3) { setError('Mot de passe trop faible. 8+ caractères, maj, min, chiffres, spéciaux.'); return; }
    setLoading(true);
    try {
      await authAdvancedAPI.verifyCode(formData.email, verificationCode, password);
      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Code invalide ou expiré');
    } finally { setLoading(false); }
  };

  const handleResendCode = async () => {
    setError(''); setLoading(true);
    try {
      const r = await authAdvancedAPI.resendCode(formData.email);
      setSuccess(r.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du renvoi du code');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', overflow: 'hidden',
      background: 'linear-gradient(135deg,#0a0e27 0%,#1a1f3a 50%,#0f1419 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      position: 'relative',
    }}>

      {/* Stars */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(80)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${1 + Math.random() * 1.5}px`,
            height: `${1 + Math.random() * 1.5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: '#fff',
            borderRadius: '50%',
            opacity: 0.3 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 580,
        margin: '0 16px',
        background: 'rgba(15,23,42,0.75)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: 16,
        boxShadow: '0 16px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 50px rgba(59,130,246,0.08)',
        padding: '22px 26px',
        zIndex: 10,
        position: 'relative',
        maxHeight: 'calc(100vh - 24px)',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            display: 'inline-flex', width: 48, height: 48,
            background: 'linear-gradient(135deg,#3b82f6,#4f46e5)',
            borderRadius: 12, alignItems: 'center', justifyContent: 'center',
            marginBottom: 10, boxShadow: '0 6px 20px rgba(59,130,246,0.35)',
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 4, textShadow: '0 0 18px rgba(255,255,255,0.4)' }}>
            Créer un Compte
          </h1>
          <p style={{ fontSize: 13, color: '#93c5fd', margin: 0 }}>
            {step === 1 ? 'Rejoignez votre organisation' : 'Vérifiez votre email'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
          {[1, 2].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: step >= s ? '#2563eb' : 'rgba(255,255,255,0.1)',
                color: step >= s ? '#fff' : 'rgba(255,255,255,0.35)',
              }}>{s}</div>
              {i === 0 && (
                <div style={{ width: 48, height: 3, borderRadius: 2, background: step >= 2 ? '#2563eb' : 'rgba(255,255,255,0.15)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ marginBottom: 12, padding: '9px 12px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 9, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <AlertCircle size={14} color="#fca5a5" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12.5, color: '#fca5a5' }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ marginBottom: 12, padding: '9px 12px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 9, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <CheckCircle size={14} color="#86efac" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12.5, color: '#86efac' }}>{success}</span>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleSubmitStep1}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>

              {/* Nom complet */}
              <div>
                <label style={lbl}>Nom Complet</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={ico} />
                  <input type="text" name="full_name" value={formData.full_name}
                    onChange={handleChange} placeholder="Jean Dupont" required style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={lbl}>Email Professionnel</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={ico} />
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="nom@entreprise.com" required style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
                </div>
              </div>

              {/* Département */}
              <div>
                <label style={lbl}>Département</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={14} style={ico} />
                  <select name="department" value={formData.department}
                    onChange={handleChange} required style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'}>
                    <option value="">Sélectionnez</option>
                    <option value="IT">Informatique</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Production">Production</option>
                    <option value="Logistique">Logistique</option>
                  </select>
                </div>
              </div>

              {/* Poste */}
              <div>
                <label style={lbl}>Poste</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={14} style={ico} />
                  <input type="text" name="position" value={formData.position}
                    onChange={handleChange} placeholder="Développeur" required style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
                </div>
              </div>

              {/* Téléphone — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Téléphone <span style={{ color: 'rgba(148,163,184,0.5)', fontWeight: 400 }}>(optionnel)</span></label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={ico} />
                  <input type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="+33 6 12 34 56 78" style={inp}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={btnPrimary}>
              {loading
                ? <><span style={spinner} /> Envoi en cours...</>
                : <><span>Recevoir le Code</span><ArrowRight size={15} /></>
              }
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmitStep2}>

            <div style={{ padding: '9px 13px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 9, marginBottom: 14, fontSize: 12.5, color: '#93c5fd' }}>
              Un code a été envoyé à <strong style={{ color: '#bfdbfe' }}>{formData.email}</strong>
            </div>

            {/* Code */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Code de Vérification</label>
              <input type="text" value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                placeholder="000000" maxLength="6" required
                style={{ ...inp, textAlign: 'center', fontSize: 22, letterSpacing: 10, fontFamily: 'monospace', paddingLeft: 14 }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
              <button type="button" onClick={handleResendCode} disabled={loading}
                style={{ fontSize: 12, color: '#93c5fd', background: 'none', border: 'none', cursor: 'pointer', marginTop: 5, padding: 0 }}>
                Renvoyer le code
              </button>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Mot de Passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={ico} />
                <input type="password" value={password} onChange={handlePasswordChange}
                  placeholder="••••••••" required style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
              </div>
              {password && (
                <div style={{ marginTop: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>Force du mot de passe</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: pwColor(passwordStrength.score) }}>{passwordStrength.message}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${(passwordStrength.score / 5) * 100}%`, background: pwColor(passwordStrength.score), transition: 'width .3s' }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(147,197,253,0.7)', marginTop: 5 }}>
                    8+ caractères, majuscules, minuscules, chiffres et caractères spéciaux
                  </p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Confirmer le Mot de Passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={ico} />
                <input type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" required style={inp}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.55)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.2)'} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                Retour
              </button>
              <button type="submit" disabled={loading}
                style={{ ...btnPrimary, flex: 1, marginBottom: 0 }}>
                {loading ? 'Création...' : 'Créer le Compte'}
              </button>
            </div>
          </form>
        )}

        {/* Link */}
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <Link to="/login" style={{ fontSize: 12.5, color: '#93c5fd', textDecoration: 'none' }}>
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        select option { background:#1e293b; color:#e2e8f0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(148,163,184,0.25); border-radius:2px; }
      `}</style>
    </div>
  );
}

/* ── style constants ── */
const lbl = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#e2e8f0', marginBottom: 5,
};
const ico = {
  position: 'absolute', left: 10, top: '50%',
  transform: 'translateY(-50%)', color: '#93c5fd', pointerEvents: 'none',
};
const inp = {
  width: '100%', padding: '8px 10px 8px 32px',
  background: 'rgba(15,23,42,0.55)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: 9, color: '#e2e8f0', fontSize: 13,
  fontFamily: 'inherit', outline: 'none',
  transition: 'border-color .2s',
};
const btnPrimary = {
  width: '100%', padding: '10px 16px', marginBottom: 0,
  background: 'linear-gradient(135deg,#3b82f6,#4f46e5)',
  border: 'none', borderRadius: 10,
  color: '#fff', fontSize: 13.5, fontWeight: 700,
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: 8,
  boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
  transition: 'opacity .2s',
};
const spinner = {
  display: 'inline-block', width: 16, height: 16,
  border: '2px solid rgba(255,255,255,0.3)',
  borderTop: '2px solid #fff', borderRadius: '50%',
  animation: 'spin .7s linear infinite',
};
function pwColor(s) {
  return s <= 2 ? '#ef4444' : s === 3 ? '#eab308' : s === 4 ? '#3b82f6' : '#22c55e';
}