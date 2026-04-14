import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAdvancedAPI } from '../services/api';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Building2, Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: 'text-slate-400'
    });

    const checkPasswordStrength = (pwd) => {
        let score = 0;
        let message = '';
        let color = '';

        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

        if (score === 0) {
            message = 'Très faible';
            color = 'text-red-600';
        } else if (score <= 2) {
            message = 'Faible';
            color = 'text-orange-600';
        } else if (score === 3) {
            message = 'Moyen';
            color = 'text-yellow-600';
        } else if (score === 4) {
            message = 'Fort';
            color = 'text-blue-600';
        } else {
            message = 'Très fort';
            color = 'text-green-600';
        }

        setPasswordStrength({ score, message, color });
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setNewPassword(pwd);
        checkPasswordStrength(pwd);
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await authAdvancedAPI.forgotPassword(email);
            setSuccess(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'envoi du code');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReset = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordStrength.score < 3) {
            setError('Le mot de passe est trop faible. Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux');
            return;
        }

        setLoading(true);

        try {
            await authAdvancedAPI.resetPassword(email, verificationCode, newPassword);
            setSuccess('Mot de passe réinitialisé avec succès ! Redirection...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Code invalide ou expiré');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await authAdvancedAPI.resendCode(email);
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors du renvoi du code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen galaxy-bg overflow-hidden relative">

            {/* Étoiles d'arrière-plan */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full animate-twinkle"
                        style={{
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: 0.3 + Math.random() * 0.5,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Formulaire */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
                <div className="w-full max-w-md">

                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <div className="inline-flex w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2 glow-text-white">
                            Mot de Passe Oublié
                        </h1>
                        <p className="text-blue-200">
                            {step === 1 ? 'Récupérez l\'accès à votre compte' : 'Créez un nouveau mot de passe'}
                        </p>
                    </div>

                    {/* Carte principale */}
                    <div className="glass-card-galaxy p-8">

                        {/* Indicateur d'étapes */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'
                                    }`}>
                                    1
                                </div>
                                <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-white/20'}`}></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'
                                    }`}>
                                    2
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="mb-6 bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 bg-green-500/20 border border-green-400/50 rounded-xl p-4 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-200">{success}</p>
                            </div>
                        )}

                        {/* Étape 1 : Email */}
                        {step === 1 && (
                            <form onSubmit={handleSubmitEmail} className="space-y-5">

                                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-blue-200">
                                        Entrez votre adresse email professionnelle. Nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Adresse Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-glass w-full pl-11 pr-4 py-3 rounded-xl"
                                            placeholder="nom@entreprise.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Envoi en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Recevoir le Code</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-sm text-blue-300 hover:text-blue-200 transition-colors flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour à la connexion</span>
                                    </Link>
                                </div>
                            </form>
                        )}

                        {/* Étape 2 : Code et nouveau mot de passe */}
                        {step === 2 && (
                            <form onSubmit={handleSubmitReset} className="space-y-5">

                                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
                                    <p className="text-blue-200 text-sm">
                                        Un code de vérification a été envoyé à <strong>{email}</strong>
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Code de Vérification
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="input-glass w-full px-4 py-3 rounded-xl text-center text-2xl font-mono tracking-widest"
                                        placeholder="000000"
                                        maxLength="6"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={loading}
                                        className="text-sm text-blue-300 hover:text-blue-200 mt-2 transition-colors"
                                    >
                                        Renvoyer le code
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Nouveau Mot de Passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                            className="input-glass w-full pl-11 pr-11 py-3 rounded-xl"
                                            placeholder="Nouveau mot de passe"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-white">Force du mot de passe</span>
                                                <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                                    {passwordStrength.message}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${passwordStrength.score <= 2 ? 'bg-red-500' :
                                                            passwordStrength.score === 3 ? 'bg-yellow-500' :
                                                                passwordStrength.score === 4 ? 'bg-blue-500' :
                                                                    'bg-green-500'
                                                        }`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-200 mt-2">
                                                Minimum 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Confirmer le Mot de Passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input-glass w-full pl-11 pr-11 py-3 rounded-xl"
                                            placeholder="Confirmez le mot de passe"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                                    >
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                                    >
                                        {loading ? 'Réinitialisation...' : 'Réinitialiser'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Lien inscription */}
                    <div className="text-center mt-6">
                        <Link to="/register" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                            Pas encore de compte ? Créez-en un
                        </Link>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
        .galaxy-bg {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
        }

        .glass-card-galaxy {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 0 60px rgba(59, 130, 246, 0.1);
        }

        .input-glass {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          transition: all 0.3s ease;
        }

        .input-glass:focus {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .input-glass::placeholder {
          color: rgba(148, 163, 184, 0.5);
        }

        .glow-text-white {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}