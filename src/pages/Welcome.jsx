import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2, CheckCircle, ArrowRight,
    LayoutDashboard, ListTodo, Users, Sparkles,
    BarChart3, MessageSquare, Calendar, Shield,
    ChevronRight
} from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();
    const { user, organization, isAdmin, orgName } = useAuth();
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Barre de progression décroissante sur 6 secondes
        const interval = setInterval(() => {
            setProgress(p => {
                if (p <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return p - (100 / 60);
            });
        }, 100);

        const timer = setTimeout(() => {
            navigate(isAdmin ? '/dashboard' : '/tasks');
        }, 6000);

        return () => { clearTimeout(timer); clearInterval(interval); };
    }, [isAdmin, navigate]);

    const handleContinue = () => {
        navigate(isAdmin ? '/dashboard' : '/tasks');
    };

    const adminFeatures = [
        { icon: LayoutDashboard, title: 'Tableau de bord', desc: 'Analytics et KPIs en temps réel' },
        { icon: Users, title: 'Gestion des équipes', desc: 'Invitez et gérez vos employés' },
        { icon: BarChart3, title: 'Analytics avancés', desc: 'Rapports et indicateurs de performance' },
        { icon: Shield, title: 'Administration', desc: 'Contrôle total de votre espace' },
    ];

    const employeeFeatures = [
        { icon: ListTodo, title: 'Mes tâches', desc: 'Vos tâches et projets assignés' },
        { icon: Calendar, title: 'Congés', desc: 'Demandes et suivi de congés' },
        { icon: MessageSquare, title: 'Messagerie', desc: 'Communication interne de l\'équipe' },
        { icon: Sparkles, title: 'Actualités', desc: 'Restez informé de votre entreprise' },
    ];

    const features = isAdmin ? adminFeatures : employeeFeatures;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fff; color: #171717;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .welcome-fade-1 { animation: fadeIn  0.5s 0.0s ease both; }
        .welcome-fade-2 { animation: fadeUp  0.5s 0.1s ease both; }
        .welcome-fade-3 { animation: fadeUp  0.5s 0.2s ease both; }
        .welcome-fade-4 { animation: fadeUp  0.5s 0.3s ease both; }
        .welcome-fade-5 { animation: fadeUp  0.5s 0.4s ease both; }
        .welcome-fade-6 { animation: fadeUp  0.5s 0.5s ease both; }
        .scale-in       { animation: scaleIn 0.4s 0.05s ease both; }

        .dot-grid {
          background-image: radial-gradient(circle, #d4d4d4 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .feature-card {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px 20px; border-radius: 12px;
          border: 1px solid #e5e5e5; background: #fff;
          transition: all 0.2s; cursor: default;
        }
        .feature-card:hover {
          background: #fafafa;
          border-color: #d4d4d4;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .btn-continue {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 24px; height: 44px; border-radius: 12px;
          background: #171717; color: #fff;
          font-size: 14px; font-weight: 500;
          font-family: 'Inter', sans-serif;
          border: 1px solid #171717; cursor: pointer;
          transition: all 0.15s; letter-spacing: -0.01em;
          text-decoration: none;
        }
        .btn-continue:hover {
          background: #262626;
          border-color: #262626;
        }
      `}</style>

            {/* Fond dot-grid comme LandingPage */}
            <div className="dot-grid" style={{
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
            }}>

                {/* Fade radial sur le dot grid */}
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0) 30%, #fff 100%)',
                    pointerEvents: 'none', zIndex: 0,
                }} />

                {/* Barre de progression en haut */}
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    height: 3, background: '#f0f0f0', zIndex: 100,
                }}>
                    <div style={{
                        height: '100%', background: '#171717',
                        width: `${progress}%`,
                        transition: 'width 0.1s linear',
                        borderRadius: '0 2px 2px 0',
                    }} />
                </div>

                {/* Navbar légère — comme LandingPage */}
                <nav className="welcome-fade-1" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                    height: 60, display: 'flex', alignItems: 'center',
                    padding: '0 24px',
                    borderBottom: '1px solid #e5e5e5',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', maxWidth: 900, margin: '0 auto',
                    }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, background: '#171717',
                                borderRadius: 7, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Building2 size={14} color="#fff" strokeWidth={2} />
                            </div>
                            <span style={{
                                fontSize: 15, fontWeight: 650, color: '#171717',
                                letterSpacing: '-0.02em',
                            }}>
                                CommSight
                            </span>
                        </div>

                        {/* Nom organisation */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px', borderRadius: 20,
                            border: '1px solid #e5e5e5', background: '#fafafa',
                            fontSize: 12.5, color: '#525252',
                        }}>
                            <CheckCircle size={12} color="#16a34a" />
                            <span style={{ fontWeight: 500 }}>{orgName}</span>
                        </div>
                    </div>
                </nav>

                {/* Contenu centré */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    width: '100%', maxWidth: 720,
                    marginTop: 60,
                    textAlign: 'center',
                }}>

                    {/* Badge rôle */}
                    <div className="welcome-fade-2" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        marginBottom: 28, padding: '5px 12px 5px 8px',
                        borderRadius: 20, border: '1px solid #e5e5e5',
                        background: '#fff', fontSize: 12.5, color: '#525252',
                        letterSpacing: '-0.01em',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <span style={{
                            fontSize: 10, background: '#171717', color: '#fff',
                            borderRadius: 5, padding: '2px 7px',
                            fontWeight: 600, letterSpacing: '0.04em',
                        }}>
                            {isAdmin ? 'ADMIN' : 'EMPLOYÉ'}
                        </span>
                        <span>
                            {isAdmin
                                ? `Espace administrateur · ${orgName}`
                                : `Vous rejoignez ${orgName}`}
                        </span>
                        <ChevronRight size={12} color="#a3a3a3" />
                    </div>

                    {/* Titre principal */}
                    <div className="welcome-fade-3">
                        <h1 style={{
                            fontSize: 'clamp(36px, 6vw, 60px)',
                            fontWeight: 700, color: '#171717',
                            letterSpacing: '-0.04em', lineHeight: 1.08,
                            marginBottom: 16,
                        }}>
                            Bienvenue,{' '}
                            <span style={{ color: '#a3a3a3' }}>
                                {user?.full_name?.split(' ')[0] || 'Utilisateur'} !
                            </span>
                        </h1>
                    </div>

                    {/* Sous-titre */}
                    <div className="welcome-fade-4">
                        <p style={{
                            fontSize: 16, color: '#737373',
                            maxWidth: 480, margin: '0 auto 40px',
                            lineHeight: 1.7, letterSpacing: '-0.01em',
                        }}>
                            {isAdmin
                                ? `Votre organisation ${orgName} est prête. Commencez par inviter vos employés et configurer vos départements.`
                                : `Votre compte est actif. Accédez à votre espace de travail et découvrez toutes vos fonctionnalités.`}
                        </p>
                    </div>

                    {/* Features grid — style LandingPage */}
                    <div className="welcome-fade-5" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 10, marginBottom: 40,
                        textAlign: 'left',
                    }}>
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="feature-card">
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 9,
                                        border: '1px solid #e5e5e5', background: '#f5f5f5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={16} color="#525252" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: 13.5, fontWeight: 600, color: '#171717',
                                            marginBottom: 3, letterSpacing: '-0.01em',
                                        }}>
                                            {f.title}
                                        </div>
                                        <div style={{ fontSize: 12.5, color: '#737373', lineHeight: 1.5 }}>
                                            {f.desc}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="welcome-fade-6">
                        <button className="btn-continue" onClick={handleContinue}>
                            {isAdmin ? 'Accéder au tableau de bord' : 'Accéder à mon espace'}
                            <ArrowRight size={16} strokeWidth={2} />
                        </button>
                        <p style={{
                            marginTop: 14, fontSize: 12.5, color: '#a3a3a3',
                        }}>
                            Redirection automatique dans quelques secondes...
                        </p>
                    </div>

                    {/* Stats strip — comme LandingPage */}
                    <div className="welcome-fade-6" style={{
                        marginTop: 48,
                        display: 'inline-flex',
                        border: '1px solid #e5e5e5', borderRadius: 14,
                        background: '#fff', overflow: 'hidden',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        {[
                            { value: isAdmin ? '0' : orgName?.charAt(0) || 'C', label: isAdmin ? 'Employés invités' : 'Entreprise', isLetter: !isAdmin },
                            { value: isAdmin ? 'Admin' : user?.department || 'Général', label: 'Rôle / Département' },
                            { value: isAdmin ? 'Actif' : 'Connecté', label: 'Statut du compte' },
                            { value: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), label: "Date d'inscription" },
                        ].map((s, i, arr) => (
                            <div key={i} style={{
                                padding: '16px 24px',
                                borderRight: i < arr.length - 1 ? '1px solid #e5e5e5' : 'none',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    fontSize: 18, fontWeight: 700, color: '#171717',
                                    letterSpacing: '-0.03em', lineHeight: 1,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 4 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="welcome-fade-6" style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    padding: '14px 24px',
                    borderTop: '1px solid #e5e5e5',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, fontSize: 12.5, color: '#a3a3a3', zIndex: 50,
                }}>
                    <Building2 size={12} color="#d4d4d4" />
                    © 2026 CommSight. Tous droits réservés.
                </div>

            </div>
        </>
    );
}