import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2, CheckCircle, ArrowRight,
    LayoutDashboard, ListTodo, Users, Sparkles
} from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();
    const { user, organization, isAdmin, orgName } = useAuth();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Animation d'entrée
        setTimeout(() => setShow(true), 100);

        // Redirection automatique après 5 secondes
        const timer = setTimeout(() => {
            handleContinue();
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        if (isAdmin) {
            navigate('/dashboard');
        } else {
            navigate('/tasks');
        }
    };

    const adminFeatures = [
        { icon: LayoutDashboard, text: 'Tableau de bord analytique' },
        { icon: Users, text: 'Gestion des employés' },
        { icon: ListTodo, text: 'Suivi des tâches et projets' },
        { icon: Sparkles, text: 'Analytics et rapports' },
    ];

    const employeeFeatures = [
        { icon: ListTodo, text: 'Vos tâches assignées' },
        { icon: CheckCircle, text: 'Demandes de congés' },
        { icon: Building2, text: 'Actualités de l\'entreprise' },
        { icon: Sparkles, text: 'Messagerie interne' },
    ];

    const features = isAdmin ? adminFeatures : employeeFeatures;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes countdown {
          from { width: 100%; }
          to   { width: 0%; }
        }

        .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.4s ease both; }
        .fade-up-4 { animation: fadeUp 0.6s 0.55s ease both; }
        .fade-up-5 { animation: fadeUp 0.6s 0.7s ease both; }
        .scale-in  { animation: scaleIn 0.5s 0.05s ease both; }

        .shimmer-text {
          background: linear-gradient(90deg, #667eea 0%, #a855f7 25%, #667eea 50%, #a855f7 75%, #667eea 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .feature-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
          cursor: default;
        }
        .feature-item:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateX(4px);
        }

        .btn-continue {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 12px;
          background: #fff; color: #1a1a2e;
          font-size: 15px; font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .btn-continue:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .countdown-bar {
          height: 3px;
          background: rgba(255,255,255,0.5);
          border-radius: 2px;
          animation: countdown 6s linear forwards;
        }
      `}</style>

            {/* Fond dégradé — même palette que Login */}
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Cercles décoratifs */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-80px', left: '-80px',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Carte principale */}
                <div style={{
                    width: '100%', maxWidth: '520px',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '24px',
                    padding: '48px 40px',
                    textAlign: 'center',
                    position: 'relative',
                }}>

                    {/* Barre de progression en haut */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        borderRadius: '24px 24px 0 0', overflow: 'hidden', height: 3,
                    }}>
                        <div className="countdown-bar" />
                    </div>

                    {/* Icône entreprise */}
                    <div className="scale-in" style={{
                        width: 80, height: 80, borderRadius: '20px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 32px rgba(102,126,234,0.4)',
                    }}>
                        <Building2 size={36} color="#fff" strokeWidth={1.5} />
                    </div>

                    {/* Titre */}
                    <div className="fade-up-1">
                        <div style={{
                            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10
                        }}>
                            {isAdmin ? 'Espace Administrateur' : 'Espace Employé'}
                        </div>
                        <h1 style={{
                            fontSize: 32, fontWeight: 800, color: '#fff',
                            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 8
                        }}>
                            Bienvenue,<br />
                            <span className="shimmer-text">{user?.full_name?.split(' ')[0] || 'Utilisateur'} !</span>
                        </h1>
                    </div>

                    {/* Nom de l'entreprise */}
                    <div className="fade-up-2" style={{
                        marginTop: 16, marginBottom: 32,
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 12,
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                    }}>
                        <CheckCircle size={16} color="#4ade80" />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                            {isAdmin ? 'Organisation créée : ' : 'Vous rejoignez : '}
                            <strong style={{ color: '#fff' }}>{orgName}</strong>
                        </span>
                    </div>

                    {/* Message contextuel */}
                    <div className="fade-up-3" style={{
                        fontSize: 14, color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.6, marginBottom: 28,
                    }}>
                        {isAdmin
                            ? `Votre espace de gestion est prêt. Vous pouvez maintenant inviter vos employés et configurer votre organisation.`
                            : `Votre compte a été créé avec succès. Vous avez accès à toutes les fonctionnalités de votre espace de travail.`
                        }
                    </div>

                    {/* Features */}
                    <div className="fade-up-4" style={{
                        display: 'flex', flexDirection: 'column', gap: 8,
                        marginBottom: 36, textAlign: 'left',
                    }}>
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="feature-item"
                                    style={{ animationDelay: `${0.6 + i * 0.08}s` }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Icon size={15} color="rgba(255,255,255,0.85)" />
                                    </div>
                                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                        {f.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bouton continuer */}
                    <div className="fade-up-5">
                        <button className="btn-continue" onClick={handleContinue}>
                            {isAdmin ? 'Accéder au tableau de bord' : 'Accéder à mon espace'}
                            <ArrowRight size={18} />
                        </button>
                        <p style={{
                            marginTop: 14, fontSize: 12,
                            color: 'rgba(255,255,255,0.35)',
                        }}>
                            Redirection automatique dans quelques secondes...
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}