import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckSquare, MessageCircle, BarChart3, Users,
    Shield, Brain, ArrowRight, ChevronRight,
    Building2, TrendingUp, Lock, Clock, Layers, Sparkles, Globe, Zap
} from 'lucide-react';

const FEATURES = [
    { icon: CheckSquare, title: 'Gestion des tâches', desc: 'Suivi en temps réel des tâches par équipe, département et priorité.' },
    { icon: MessageCircle, title: 'Communication interne', desc: "Messagerie, publications et notifications centralisées pour toute l'entreprise." },
    { icon: Brain, title: 'Intelligence artificielle', desc: 'Analyse émotionnelle, score de santé organisationnelle et alertes prédictives.' },
    { icon: BarChart3, title: 'Analytics avancés', desc: 'Tableaux de bord, KPIs et rapports détaillés par département.' },
    { icon: Users, title: 'Gestion RH complète', desc: 'Congés, profils employés, organigramme et évaluation de performance.' },
    { icon: Shield, title: 'Sécurité & conformité', desc: 'Multi-tenant isolé, chiffrement des données, RGPD et audit trail.' },
    { icon: Globe, title: 'Multi-entreprises', desc: 'Architecture multi-tenant : chaque entreprise est totalement isolée.' },
    { icon: Layers, title: 'Enquêtes & feedbacks', desc: 'Questionnaires intelligents, boîte à idées et sondages internes.' },
];

function FeatureCard({ icon: Icon, title, desc }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: '28px',
                border: `1px solid ${hov ? '#d4d4d4' : '#e5e5e5'}`,
                borderRadius: 16,
                background: hov ? '#fafafa' : '#fff',
                transition: 'all .2s',
                cursor: 'default',
            }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10,
                border: '1px solid #e5e5e5', background: '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
            }}>
                <Icon size={18} color="#525252" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#171717', marginBottom: 8, letterSpacing: '-0.01em' }}>{title}</div>
            <div style={{ fontSize: 13.5, color: '#737373', lineHeight: 1.65 }}>{desc}</div>
        </div>
    );
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fff; color: #171717; overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .nav-link { font-size: 13.5px; color: #525252; text-decoration: none; letter-spacing: -0.01em; transition: color .15s; font-weight: 450; }
        .nav-link:hover { color: #171717; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0 18px; height: 38px; border-radius: 10px;
          background: #171717; color: #fff; font-size: 13.5px; font-weight: 500;
          font-family: 'Inter', sans-serif; text-decoration: none; letter-spacing: -0.01em;
          border: 1px solid #171717; transition: background .15s; cursor: pointer;
        }
        .btn-primary:hover { background: #262626; border-color: #262626; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0 18px; height: 38px; border-radius: 10px;
          background: #fff; color: #171717; font-size: 13.5px; font-weight: 500;
          font-family: 'Inter', sans-serif; text-decoration: none; letter-spacing: -0.01em;
          border: 1px solid #e5e5e5; transition: all .15s; cursor: pointer;
        }
        .btn-secondary:hover { background: #fafafa; border-color: #d4d4d4; }
        .btn-lg-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 24px; height: 44px; border-radius: 12px;
          background: #171717; color: #fff; font-size: 14px; font-weight: 500;
          font-family: 'Inter', sans-serif; text-decoration: none; letter-spacing: -0.015em;
          border: 1px solid #171717; transition: background .15s; cursor: pointer;
        }
        .btn-lg-primary:hover { background: #262626; }
        .btn-lg-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 24px; height: 44px; border-radius: 12px;
          background: #fff; color: #171717; font-size: 14px; font-weight: 500;
          font-family: 'Inter', sans-serif; text-decoration: none; letter-spacing: -0.015em;
          border: 1px solid #e5e5e5; transition: all .15s; cursor: pointer;
        }
        .btn-lg-secondary:hover { background: #fafafa; border-color: #d4d4d4; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #fff; }
        ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
        .dot-grid {
          background-image: radial-gradient(circle, #d4d4d4 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60,
                display: 'flex', alignItems: 'center', padding: '0 24px',
                borderBottom: scrolled ? '1px solid #e5e5e5' : '1px solid transparent',
                background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                transition: 'all .2s',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                            <div style={{ width: 28, height: 28, background: '#171717', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={14} color="#fff" strokeWidth={2} />
                            </div>
                            <span style={{ fontSize: 15, fontWeight: 650, color: '#171717', letterSpacing: '-0.02em' }}>CommSight</span>
                        </Link>
                        <div style={{ display: 'flex', gap: 28 }}>
                            {['Fonctionnalités', 'Tarifs', 'Sécurité', 'Contact'].map(l => (
                                <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link to="/login" className="btn-secondary">Connexion</Link>
                        <Link to="/register" className="btn-primary">Démarrer <ChevronRight size={13} strokeWidth={2} /></Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="dot-grid" style={{
                position: 'relative', minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px', textAlign: 'center',
            }}>
                {/* Fade edge over dot grid */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0) 30%, #fff 100%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 32,
                        padding: '5px 12px 5px 8px', borderRadius: 20, border: '1px solid #e5e5e5',
                        background: '#fff', textDecoration: 'none', color: '#525252', fontSize: 12.5,
                        letterSpacing: '-0.01em', animation: 'fadeIn .6s ease both',
                    }}>
                        <span style={{ fontSize: 10, background: '#171717', color: '#fff', borderRadius: 5, padding: '2px 7px', fontWeight: 600, letterSpacing: '0.04em' }}>NEW</span>
                        <span>CommSight v2 avec IA intégrée est disponible</span>
                        <ChevronRight size={12} color="#a3a3a3" />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, color: '#171717',
                        lineHeight: 1.06, letterSpacing: '-0.04em', maxWidth: 780, margin: '0 auto 24px',
                        animation: 'fadeUp .6s .05s ease both',
                    }}>
                        Gérez votre entreprise.<br />
                        <span style={{ color: '#a3a3a3' }}>Livrez plus vite.</span>
                    </h1>

                    <p style={{
                        fontSize: 16.5, color: '#737373', maxWidth: 500, lineHeight: 1.7, margin: '0 auto 36px',
                        letterSpacing: '-0.01em', animation: 'fadeUp .6s .1s ease both',
                    }}>
                        CommSight unifie communication interne, gestion des tâches et intelligence RH dans une seule plateforme sécurisée.
                    </p>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64, animation: 'fadeUp .6s .15s ease both' }}>
                        <Link to="/register" className="btn-lg-primary">Démarrer gratuitement <ArrowRight size={14} strokeWidth={2} /></Link>
                        <Link to="/pricing" className="btn-lg-secondary">Voir les tarifs</Link>
                    </div>

                    {/* Stats strip */}
                    <div style={{
                        display: 'inline-flex', border: '1px solid #e5e5e5', borderRadius: 14,
                        background: '#fff', overflow: 'hidden', animation: 'fadeUp .6s .2s ease both',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        {[
                            { value: '500+', label: 'Entreprises' },
                            { value: '50k+', label: 'Employés actifs' },
                            { value: '99.9%', label: 'Disponibilité' },
                            { value: '4.9★', label: 'Note moyenne' },
                        ].map((s, i, arr) => (
                            <div key={i} style={{ padding: '20px 32px', borderRight: i < arr.length - 1 ? '1px solid #e5e5e5' : 'none', textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 4, letterSpacing: '-0.01em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LOGOS STRIP */}
            <div style={{ borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, background: '#fafafa' }}>
                <span style={{ fontSize: 12, color: '#a3a3a3', letterSpacing: '-0.01em', marginRight: 20, flexShrink: 0 }}>Utilisé par</span>
                {['TechCorp', 'StartupTN', 'Groupe Lafarge', 'Sonatrach', 'Orange DZ', 'Cevital'].map((name, i) => (
                    <span key={name} style={{ fontSize: 12.5, color: '#b5b5b5', fontWeight: 500, padding: '0 18px', borderLeft: '1px solid #e5e5e5' }}>{name}</span>
                ))}
            </div>

            {/* FEATURES */}
            <section id="fonctionnalités" style={{ padding: '96px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, border: '1px solid #e5e5e5', background: '#fafafa', fontSize: 12, color: '#525252', fontWeight: 500, marginBottom: 16 }}>
                        <Sparkles size={11} color="#a3a3a3" /> Fonctionnalités
                    </div>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14 }}>
                        Tout ce dont votre équipe a besoin.
                    </h2>
                    <p style={{ fontSize: 15, color: '#737373', maxWidth: 500, margin: '0 auto', lineHeight: 1.65, letterSpacing: '-0.01em' }}>
                        Une suite complète d'outils professionnels, alimentée par l'IA, pour les équipes de toutes tailles.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                    {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ borderTop: '1px solid #e5e5e5', padding: '96px 24px', background: '#fafafa' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12, color: '#525252', fontWeight: 500, marginBottom: 16 }}>En 3 étapes</div>
                        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                            Opérationnel en moins de 10 minutes.
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { num: '01', icon: Building2, title: 'Créez votre espace', desc: 'Inscrivez votre entreprise et configurez vos départements en quelques clics.' },
                            { num: '02', icon: Users, title: 'Invitez vos équipes', desc: 'Vos employés reçoivent une invitation par email et créent leur compte sécurisé.' },
                            { num: '03', icon: TrendingUp, title: 'Analysez & optimisez', desc: "L'IA analyse immédiatement les données et génère vos premiers insights." },
                        ].map(s => (
                            <div key={s.num} style={{ padding: '36px 28px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                                <div style={{ fontSize: 11, color: '#d4d4d4', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 20 }}>{s.num}</div>
                                <div style={{ width: 38, height: 38, border: '1px solid #e5e5e5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: '#fafafa' }}>
                                    <s.icon size={16} color="#525252" strokeWidth={1.5} />
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#171717', marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</div>
                                <div style={{ fontSize: 13.5, color: '#737373', lineHeight: 1.65 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECURITY */}
            <section id="sécurité" style={{ borderTop: '1px solid #e5e5e5', padding: '96px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, border: '1px solid #e5e5e5', background: '#fafafa', fontSize: 12, color: '#525252', fontWeight: 500, marginBottom: 20 }}>
                            <Shield size={11} color="#a3a3a3" /> Sécurité
                        </div>
                        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
                            Vos données, entièrement isolées et protégées.
                        </h2>
                        <p style={{ fontSize: 14.5, color: '#737373', lineHeight: 1.7, marginBottom: 28 }}>
                            Architecture multi-tenant avec isolation complète des données. Chaque entreprise dispose de sa propre base de données chiffrée.
                        </p>
                        <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
                            {[
                                { icon: Lock, text: 'Chiffrement AES-256 au repos et en transit' },
                                { icon: Globe, text: 'Hébergement EU conforme RGPD, audit trail complet' },
                                { icon: Clock, text: 'Sauvegardes automatiques toutes les 6 heures' },
                                { icon: Shield, text: 'Isolation totale entre tenants — aucune fuite possible' },
                            ].map((item, i, arr) => (
                                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none', background: '#fff' }}>
                                    <item.icon size={14} color="#a3a3a3" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 13.5, color: '#525252' }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden' }}>
                        {[
                            { label: 'Uptime garanti', value: '99.9%' },
                            { label: 'Pays desservis', value: '45+' },
                            { label: 'Temps de réponse', value: '<80ms' },
                            { label: 'Certification', value: 'ISO 27001' },
                        ].map((s, i) => (
                            <div key={s.label} style={{ padding: '36px 28px', borderRight: i % 2 === 0 ? '1px solid #e5e5e5' : 'none', borderBottom: i < 2 ? '1px solid #e5e5e5' : 'none', background: '#fff' }}>
                                <div style={{ fontSize: 30, fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                                <div style={{ fontSize: 13, color: '#a3a3a3' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ borderTop: '1px solid #e5e5e5', padding: '96px 24px', background: '#fafafa' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', marginBottom: 10 }}>
                            Ils nous font confiance.
                        </h2>
                        <p style={{ fontSize: 14.5, color: '#a3a3a3' }}>Des équipes du monde entier améliorent leur performance avec CommSight.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { name: 'Sarah K.', role: 'DRH · TechCorp Maroc', text: "CommSight a transformé notre communication interne. Le module IA détecte les tensions avant qu'elles deviennent des problèmes." },
                            { name: 'Ahmed B.', role: 'CEO · StartupTunisie', text: "Interface intuitive, données isolées, support réactif. Exactement ce dont nous avions besoin pour notre croissance." },
                            { name: 'Marie L.', role: 'Manager · Groupe Lafarge', text: "Le tableau de bord analytique nous fait économiser 5h de reporting par semaine. ROI immédiat." },
                        ].map(t => (
                            <div key={t.name} style={{ padding: '28px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16 }}>
                                <div style={{ marginBottom: 14, color: '#171717', fontSize: 13, letterSpacing: 1 }}>★★★★★</div>
                                <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f5f5f5', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#525252' }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: '#a3a3a3' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ borderTop: '1px solid #e5e5e5', padding: '96px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: 560, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16 }}>
                        Prêt à démarrer ?
                    </h2>
                    <p style={{ fontSize: 15, color: '#737373', marginBottom: 32, lineHeight: 1.65 }}>
                        Rejoignez 500+ entreprises qui font confiance à CommSight. Démarrez gratuitement, sans carte bancaire.
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-lg-primary">Démarrer gratuitement <ArrowRight size={14} /></Link>
                        <Link to="/pricing" className="btn-lg-secondary">Voir les tarifs</Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid #e5e5e5', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, background: '#171717', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={12} color="#fff" strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 650, color: '#171717', letterSpacing: '-0.02em' }}>CommSight</span>
                </div>
                <p style={{ fontSize: 12.5, color: '#a3a3a3' }}>© 2026 CommSight. Tous droits réservés.</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {['Confidentialité', 'CGU', 'Contact'].map(l => (
                        <a key={l} href="#" style={{ fontSize: 12.5, color: '#a3a3a3', textDecoration: 'none', transition: 'color .15s' }}
                            onMouseEnter={e => e.target.style.color = '#171717'}
                            onMouseLeave={e => e.target.style.color = '#a3a3a3'}>{l}</a>
                    ))}
                </div>
            </footer>
        </>
    );
}