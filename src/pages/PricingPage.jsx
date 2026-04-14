import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Check, X, Zap, Crown, Infinity, ArrowRight,
    Building2, Shield, BarChart3, HelpCircle, Star, ChevronRight
} from 'lucide-react';

/* ── Plans data ── */
const PLANS = [
    {
        id: 'monthly',
        icon: Zap,
        name: 'Mensuel',
        badge: null,
        price: { amount: 29, currency: '€', period: '/mois/entreprise' },
        priceNote: 'Facturation mensuelle',
        accent: '#525252',
        popular: false,
        cta: 'Démarrer',
        features: [
            { text: "Jusqu'à 50 employés", included: true },
            { text: '5 départements', included: true },
            { text: 'Gestion des tâches', included: true },
            { text: 'Communication interne', included: true },
            { text: 'Messagerie', included: true },
            { text: 'Gestion des congés', included: true },
            { text: 'Enquêtes & feedbacks', included: true },
            { text: 'Analytics de base', included: true },
            { text: 'Analyse IA avancée', included: false },
            { text: 'Score santé psychologique', included: false },
            { text: 'Coach IA pour managers', included: false },
            { text: 'Multi-département illimité', included: false },
            { text: 'API accès', included: false },
            { text: 'Support prioritaire', included: false },
            { text: 'Accès à vie', included: false },
        ],
    },
    {
        id: 'annual',
        icon: Crown,
        name: 'Annuel',
        badge: 'Populaire',
        price: { amount: 19, currency: '€', period: '/mois/entreprise' },
        priceNote: 'Facturé 228 €/an · économisez 35 %',
        accent: '#171717',
        popular: true,
        cta: 'Choisir Annuel',
        features: [
            { text: "Jusqu'à 200 employés", included: true },
            { text: 'Départements illimités', included: true },
            { text: 'Gestion des tâches', included: true },
            { text: 'Communication interne', included: true },
            { text: 'Messagerie', included: true },
            { text: 'Gestion des congés', included: true },
            { text: 'Enquêtes & feedbacks', included: true },
            { text: 'Analytics avancés', included: true },
            { text: 'Analyse IA avancée', included: true },
            { text: 'Score santé psychologique', included: true },
            { text: 'Coach IA pour managers', included: true },
            { text: 'Multi-département illimité', included: true },
            { text: 'API accès', included: false },
            { text: 'Support prioritaire', included: true },
            { text: 'Accès à vie', included: false },
        ],
    },
    {
        id: 'lifetime',
        icon: Infinity,
        name: 'À Vie',
        badge: 'Meilleur choix',
        price: { amount: 599, currency: '€', period: 'paiement unique' },
        priceNote: 'Un seul paiement · pour toujours',
        accent: '#525252',
        popular: false,
        cta: "Obtenir l'accès à vie",
        features: [
            { text: 'Employés illimités', included: true },
            { text: 'Départements illimités', included: true },
            { text: 'Gestion des tâches', included: true },
            { text: 'Communication interne', included: true },
            { text: 'Messagerie', included: true },
            { text: 'Gestion des congés', included: true },
            { text: 'Enquêtes & feedbacks', included: true },
            { text: 'Analytics avancés', included: true },
            { text: 'Analyse IA avancée', included: true },
            { text: 'Score santé psychologique', included: true },
            { text: 'Coach IA pour managers', included: true },
            { text: 'Multi-département illimité', included: true },
            { text: 'API accès', included: true },
            { text: 'Support prioritaire 24/7', included: true },
            { text: 'Toutes les futures fonctions', included: true },
        ],
    },
];

const FAQS = [
    { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les ajustements sont proratisés automatiquement.' },
    { q: "Comment fonctionne l'isolation des données ?", a: "Chaque entreprise dispose de sa propre base de données isolée. Il est techniquement impossible qu'une entreprise accède aux données d'une autre." },
    { q: "Y a-t-il une période d'essai gratuite ?", a: 'Oui, 14 jours d\'essai gratuit sur tous les plans, sans carte bancaire requise.' },
    { q: 'Que comprend le support prioritaire ?', a: 'Réponse garantie en moins de 2h par chat et email, avec un gestionnaire de compte dédié pour les plans Annuel et À Vie.' },
    { q: 'Les mises à jour sont-elles incluses ?', a: 'Toutes les mises à jour de sécurité sont incluses sur tous les plans. Les nouvelles fonctionnalités sont incluses À Vie.' },
];

function PlanCard({ plan }) {
    const [hov, setHov] = useState(false);
    const highlighted = plan.popular;
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: 'relative',
                background: highlighted ? '#171717' : '#fff',
                border: `1px solid ${highlighted ? '#171717' : hov ? '#d4d4d4' : '#e5e5e5'}`,
                borderRadius: 18,
                padding: '32px 28px 28px',
                transition: 'all .2s',
                transform: highlighted ? 'scale(1.02)' : hov ? 'translateY(-3px)' : 'none',
                boxShadow: highlighted ? '0 8px 32px rgba(0,0,0,0.12)' : hov ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                display: 'flex', flexDirection: 'column',
            }}
        >
            {plan.badge && (
                <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 14px', borderRadius: 20,
                    background: highlighted ? '#fff' : '#171717',
                    color: highlighted ? '#171717' : '#fff',
                    fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
                    whiteSpace: 'nowrap', border: `1px solid ${highlighted ? '#e5e5e5' : '#171717'}`,
                }}>
                    {plan.badge}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: highlighted ? 'rgba(255,255,255,0.12)' : '#f5f5f5',
                        border: `1px solid ${highlighted ? 'rgba(255,255,255,0.15)' : '#e5e5e5'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <plan.icon size={18} color={highlighted ? '#fff' : '#525252'} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 650, color: highlighted ? '#fff' : '#171717' }}>{plan.name}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 42, fontWeight: 700, color: highlighted ? '#fff' : '#171717', letterSpacing: -2, lineHeight: 1 }}>
                        {plan.price.currency}{plan.price.amount}
                    </span>
                    <span style={{ fontSize: 13, color: highlighted ? 'rgba(255,255,255,0.45)' : '#a3a3a3', fontWeight: 400 }}>
                        {plan.price.period}
                    </span>
                </div>
                <div style={{ fontSize: 12.5, color: highlighted ? 'rgba(255,255,255,0.55)' : '#a3a3a3', fontWeight: 450 }}>{plan.priceNote}</div>
            </div>

            {/* CTA */}
            <Link to="/register" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '11px 20px', borderRadius: 10, marginBottom: 24,
                background: highlighted ? '#fff' : '#171717',
                border: `1px solid ${highlighted ? '#fff' : '#171717'}`,
                color: highlighted ? '#171717' : '#fff',
                textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
                transition: 'all .15s',
            }}>
                {plan.cta} <ArrowRight size={13} />
            </Link>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${highlighted ? 'rgba(255,255,255,0.1)' : '#f0f0f0'}`, marginBottom: 20 }} />

            {/* Features */}
            <div style={{ flex: 1 }}>
                {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                            width: 17, height: 17, borderRadius: 5, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: f.included
                                ? highlighted ? 'rgba(255,255,255,0.15)' : '#f0f0f0'
                                : 'transparent',
                        }}>
                            {f.included
                                ? <Check size={10} color={highlighted ? '#fff' : '#525252'} />
                                : <X size={10} color={highlighted ? 'rgba(255,255,255,0.2)' : '#d4d4d4'} />
                            }
                        </div>
                        <span style={{ fontSize: 13, color: f.included ? (highlighted ? 'rgba(255,255,255,0.82)' : '#525252') : (highlighted ? 'rgba(255,255,255,0.22)' : '#d4d4d4') }}>
                            {f.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{
            background: '#fff', border: `1px solid ${open ? '#d4d4d4' : '#e5e5e5'}`,
            borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s',
        }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#171717' }}>{q}</span>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: open ? '#171717' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>
                    <span style={{ fontSize: 14, color: open ? '#fff' : '#a3a3a3', lineHeight: 1, marginTop: open ? 0 : -1 }}>{open ? '−' : '+'}</span>
                </div>
            </button>
            {open && (
                <div style={{ padding: '0 20px 16px', fontSize: 13.5, color: '#737373', lineHeight: 1.65, borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ paddingTop: 12 }}>{a}</div>
                </div>
            )}
        </div>
    );
}

export default function PricingPage() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter','Segoe UI',sans-serif;overflow-x:hidden;background:#fff;color:#171717;-webkit-font-smoothing:antialiased}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#fff}
        ::-webkit-scrollbar-thumb{background:#e5e5e5;border-radius:4px}
        .dot-grid{background-image:radial-gradient(circle,#d4d4d4 1px,transparent 1px);background-size:24px 24px}
      `}</style>

            <div style={{ position: 'relative', minHeight: '100vh', background: '#fff' }}>

                {/* NAVBAR */}
                <nav style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    padding: '0 40px', height: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    borderBottom: scrolled ? '1px solid #e5e5e5' : 'none',
                    transition: 'all .2s',
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#171717', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={14} color="#fff" />
                        </div>
                        <div>
                            <span style={{ fontSize: 15, fontWeight: 650, color: '#171717', letterSpacing: '-0.02em' }}>CommSight</span>
                        </div>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link to="/login" style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e5e5e5', color: '#525252', textDecoration: 'none', fontSize: 13.5, fontWeight: 500, background: '#fff' }}>
                            Connexion
                        </Link>
                        <Link to="/register" style={{ padding: '7px 18px', borderRadius: 8, background: '#171717', color: '#fff', textDecoration: 'none', fontSize: 13.5, fontWeight: 600 }}>
                            Essai gratuit
                        </Link>
                    </div>
                </nav>

                {/* HERO */}
                <section className="dot-grid" style={{ position: 'relative', padding: '120px 40px 64px', textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0) 30%, #fff 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: '#fafafa', border: '1px solid #e5e5e5', marginBottom: 22, animation: 'fadeUp .6s ease' }}>
                            <Star size={11} color="#a3a3a3" />
                            <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 450 }}>14 jours d'essai gratuit · sans carte bancaire</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: '#171717', letterSpacing: -2, lineHeight: 1.1, marginBottom: 16, animation: 'fadeUp .6s .08s ease both' }}>
                            Un abonnement simple,{' '}
                            <span style={{ color: '#a3a3a3' }}>zéro surprise</span>
                        </h1>
                        <p style={{ fontSize: 16.5, color: '#737373', lineHeight: 1.7, marginBottom: 8, animation: 'fadeUp .6s .15s ease both' }}>
                            Choisissez le plan adapté à la taille et aux ambitions de votre entreprise.
                        </p>
                        <p style={{ fontSize: 13.5, color: '#a3a3a3', animation: 'fadeUp .6s .2s ease both' }}>
                            Tous les plans incluent l'isolation complète des données et une infrastructure dédiée.
                        </p>
                    </div>
                </section>

                {/* PLANS */}
                <section style={{ padding: '0 40px 80px', maxWidth: 1150, margin: '0 auto' }}>
                    {/* Trial banner */}
                    <div style={{
                        textAlign: 'center', marginBottom: 44, padding: '13px 20px',
                        background: '#fafafa', border: '1px solid #e5e5e5',
                        borderRadius: 12,
                    }}>
                        <span style={{ fontSize: 13.5, color: '#525252', fontWeight: 450 }}>
                            🎁 Tous les plans commencent par <strong style={{ color: '#171717', fontWeight: 600 }}>14 jours d'essai gratuit complet</strong> — aucune carte requise, annulable à tout moment.
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
                        {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} />)}
                    </div>
                </section>

                {/* COMPARISON TABLE */}
                <section style={{ padding: '0 40px 80px', maxWidth: 1000, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#171717', letterSpacing: -1, textAlign: 'center', marginBottom: 32 }}>
                        Comparaison détaillée
                    </h2>
                    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
                            <div style={{ padding: '16px 20px', fontSize: 12.5, color: '#a3a3a3', fontWeight: 500 }}>Fonctionnalité</div>
                            {PLANS.map(p => (
                                <div key={p.id} style={{ padding: '16px 12px', textAlign: 'center', borderLeft: '1px solid #e5e5e5' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>{p.name}</div>
                                    <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 2 }}>
                                        {p.price.currency}{p.price.amount}{p.id === 'lifetime' ? '' : '/mo'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {[
                            { label: 'Employés', vals: ['50', '200', 'Illimité'] },
                            { label: 'Départements', vals: ['5', 'Illimité', 'Illimité'] },
                            { label: 'Stockage', vals: ['5 Go', '25 Go', '100 Go'] },
                            { label: 'Gestion des tâches', vals: [true, true, true] },
                            { label: 'Communication interne', vals: [true, true, true] },
                            { label: 'Messagerie', vals: [true, true, true] },
                            { label: 'Congés & RH', vals: [true, true, true] },
                            { label: 'Enquêtes & feedbacks', vals: [true, true, true] },
                            { label: 'Analytics de base', vals: [true, true, true] },
                            { label: 'Analytics avancés', vals: [false, true, true] },
                            { label: 'Analyse IA', vals: [false, true, true] },
                            { label: 'Score santé psycho.', vals: [false, true, true] },
                            { label: 'Coach IA managers', vals: [false, true, true] },
                            { label: 'API accès', vals: [false, false, true] },
                            { label: 'Support prioritaire', vals: [false, true, true] },
                            { label: 'Futures fonctions', vals: [false, false, true] },
                        ].map((row, ri) => (
                            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: '1px solid #f5f5f5', background: ri % 2 === 0 ? '#fff' : '#fafafa' }}>
                                <div style={{ padding: '12px 20px', fontSize: 13, color: '#525252' }}>{row.label}</div>
                                {row.vals.map((v, ci) => (
                                    <div key={ci} style={{ padding: '12px', textAlign: 'center', borderLeft: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {typeof v === 'boolean'
                                            ? v
                                                ? <div style={{ width: 20, height: 20, borderRadius: 5, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Check size={11} color="#525252" />
                                                </div>
                                                : <X size={13} color="#d4d4d4" />
                                            : <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>{v}</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

                {/* TRUST BADGES */}
                <section style={{ padding: '0 40px 72px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                        {[
                            { icon: Shield, label: 'RGPD Conforme', sub: 'Données EU protégées' },
                            { icon: Building2, label: 'Multi-tenant isolé', sub: '0 fuite entre entreprises' },
                            { icon: Star, label: '4.9/5 satisfaction', sub: 'Sur 500+ entreprises' },
                            { icon: BarChart3, label: '99.9% uptime', sub: 'SLA garanti contractuel' },
                        ].map(b => (
                            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12 }}>
                                <b.icon size={16} color="#525252" style={{ flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>{b.label}</div>
                                    <div style={{ fontSize: 11.5, color: '#a3a3a3' }}>{b.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section style={{ padding: '0 40px 80px', maxWidth: 680, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#171717', letterSpacing: -1, textAlign: 'center', marginBottom: 32 }}>
                        Questions fréquentes
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
                    </div>
                </section>

                {/* FINAL CTA */}
                <section style={{ padding: '0 40px 80px', textAlign: 'center' }}>
                    <div style={{ maxWidth: 580, margin: '0 auto', padding: '52px 44px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 20 }}>
                        <h2 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 700, color: '#171717', letterSpacing: -1, marginBottom: 12 }}>
                            Commencez gratuitement dès aujourd'hui
                        </h2>
                        <p style={{ fontSize: 15, color: '#737373', marginBottom: 28, lineHeight: 1.65 }}>
                            14 jours d'accès complet, sans engagement. Aucune carte bancaire requise.
                        </p>
                        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: '#171717', color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>
                            Créer mon espace CommSight <ArrowRight size={15} />
                        </Link>
                    </div>
                </section>

                {/* FOOTER */}
                <footer style={{ borderTop: '1px solid #e5e5e5', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 22, height: 22, background: '#171717', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={12} color="#fff" />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 650, color: '#171717', letterSpacing: '-0.02em' }}>CommSight</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: '#a3a3a3' }}>© 2026 CommSight. Tous droits réservés.</p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Confidentialité', 'CGU', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ fontSize: 12.5, color: '#a3a3a3', textDecoration: 'none' }}
                                onMouseEnter={e => e.target.style.color = '#171717'}
                                onMouseLeave={e => e.target.style.color = '#a3a3a3'}>{l}</a>
                        ))}
                    </div>
                </footer>
            </div>
        </>
    );
}