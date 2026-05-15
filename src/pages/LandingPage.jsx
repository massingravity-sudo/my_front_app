import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckSquare, MessageCircle, BarChart3, Users,
    Shield, Brain, ArrowRight, ChevronRight,
    Building2, TrendingUp, Lock, Clock, Layers, Sparkles, Globe, Zap, Star, Play
} from 'lucide-react';

const LOGO_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABoAPsDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAQHBQYIAwkCAf/EAEMQAAEDAwIEAwYDBQUGBwAAAAECAwQABREGEgcTFCEIMUEVIlFTYZMWMoEXM1JxoSNCcpGxCRgkgpLBNjhidHaz0f/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAxEQACAQIEAgkDBAMAAAAAAAAAAQIDEQQSITFBUQUTImFxgZHB8DKh4UKx0fEUYoL/2gAMAwEAAhEDEQA/AOw+kT86R9006RPzpH3TUilAR+kT86R9006RPzpH3TUilAQ5TceLGckyJbzTLSSta1PEBIHmTVZftYtntnkdDO9nb9vU9Sd+P4tmPL6Zz/pWF4wa49sSVWO1PZtzKv7ZxJ7PrH+qR/U9/hVZdQx1XS85vn7OZy9w3bc43Y88Z7Zr7DovoCnKlnxK1ey2t+TxMX0jJTy0tkdaRW48qM3Jjy3nWXUhaFpeJCgfIivTpE/OkfdNUpwf1x7Hkpsd1exbnlf2Lij2YWf9En+h7/Grzr57pHATwVXJLbg+aPSwuJjiIZlvxI/SJ+dI+6adIn50j7pqRSuA6SP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoCP0ifnSPumnSJ+dI+6akUoBSlKAVo/GyfcIGilmAVoD7yWZDifNLZBz/LJAGfrj1rO671XYNF6eev2pLg3BgtYG5WSpaj5IQkd1KPwH1PkDXI/F3xU3m+tP2nRNsbtVuXlK5U1pD0h1P+A5QgH4HcfqK7sBGSrRqZbpMwxFnTcb2bNos1om3bqjEby3EjrkPrP5UISknuficYArlz8TXf8AEv4h6k9bv3Z/u4/gx/DjtivG7X+9XYn2jdJclJJVy1OHYD9Ej3R+gqHBiyZ0xmFCjuyJL7iW2WmklS3Fk4CQB3JJ9K+mxWNnWndaJbfyeZQw0acbPVs61vNom2kxTLawiXHRIYWPyrQpIPY/EZwRV6cE59wn6JQZ5WsMPKZjuK81NgDH88Ekfpj0rNWaxsu6QtFsv8CJKejQ2W3UOIStKXEoAVjP1B7iszHZZjMIYjtNstIGEIbSEpSPgAPKvIx/TKxmGVKce0nv/HidOGwPUVXOL05HpSlK8I9EUqFe7ta7HbXbnebhFt8JkZcfkuhtCfhkntVeRfEDwek3BMFvW0VLqlbQpyK+23n6uKQEAfXOKtGEp/SrkNqOrLQpXlEkR5cVqVEfakR3kBbbrSwpC0kZBBHYg/EV61VqxO4pSlAKUpQClKUApSsNq7VWndI2s3PUt5h2uLnalb7mCtWM7Up81HHoATQGZpVZ2Xj3wiu9wRBh61hpeWcJMlh6MjP+N1CU/wBa2/W+r9O6LsJvupriINuDiWucGXHfeV+UYbSo98fCrypzjbMrXIUk9mZ2lY7TN8tepbDEvtlldVbpjfMjvctSN6c4ztUAR5eoFZGqtOLswmmroUrCa21XYNGWBy+6ln9Dbm1pQt7krcwpRwkbUJKvP6VI0rf7TqjT8S/WKX1dtmJKmHuWpG8BRSfdWAodwfMUytrNbQNpOxk6UryakxnZD0dqQ048xt5raVgqbyMjcPMZHlmoJPWlKUArEax1HaNJaam6hvspMaBDb3uLPmfQJSPVROAB6k1l64t8dHEBy66tjaBgukQrRtfmYPZyStOUj6hCFf5rUPStsPR62aiUnPKrlTcaeJt84m6rculycWzAaUpNvgBWURm/+6z23K9T8AABtPAvgDqXiQ2i7y3TZNPbsCW62VOSMeYaR2yPTcSBnyzgiv74VuEyOJGrnZ14Qr8PWkoXKSMjqXD3SyD6A4JUR3x27bgR39HZZjsNx47SGmWkhDbaEhKUJAwAAPIAelejicSqK6umYU6eftSKx0ZwB4V6YZQG9MR7rISnCpF0/wCJUs/Har3Af5JFb1atLaYtMpMq1acs8CQkFKXY0JttYB7YBSAcVl6V5cqk5bs6VFLYUpSqEilKUBxvx2k3Ti54mIPDBqe5Gs8B8MYR3AUG+Y+7j1WBlIz8PqatW++FzhfK0w7b7VAmQLmGcM3EzXXF8wDspaFEoIJ8wEjtnGKqLU0xrht42vbt+JYtkuTzw+r8oakMlvf/ACSsqB/wmurdZa10/pfRcnVc65xDAbYLrC0vJIkq2kpQ2QfeKvTFdtScqeHp5Ha61tz4/wBGaWbEST8vA0ngLoq78IeHtwiau1VCl29gqljYhSWoKQCXMLUclJxnG1ODnzzWmyvE87cZ8waG4Yag1RbYf76a2pbYSO/vFKGnNqSASNxBx5gVp+rOKereKPhh1fcptij25uFKiMOSIji9kgF1JWkIVkpCct59453Vbng79lfsDsns3l8zmP8AWbcbufzVZ3fXbsxn0xV5wfbq1ldppW8Ve+nd9zOMopRhDZ3189vH2JvD/jdpfW+i71fLMy+ifZobkqVbJKghzCUFQwoZBSSMbh5eoHYVoGn/ABTG/WZw2bhrerpfkOqPsyA8qQlDCQn+1W4lrKclRGAg/l7kZFVkwGj4nOIp01t9mi13bq+V+THTHf5dsc/H64re/wDZ8MtDTmq5AbTzlTGEFeO5SEKIH8sk/wCdT1NLI6ltMsZW5XbViZTlFqHHM1fwSZnNO+KnT14sjgb0nel6nLnKjWSIDIVJJBOUuBI7DHfKcjPYK74zvB/j/C1vrV3Rl70tN0vfAF8qPIe5m9SBuUhWUIUhYAJwU+QPfyBqrwqRY/8AvQ65Vyk5jpn8nt+T/i0jt+navW6pSn/aCR9oAy62Tj49BUqlSlNRy/VHNvsRKU1Gbv8AS/X5c3NHighjVN902vQ9ykXGDKciW+PAfMl2e6hxScbQ2NgwnJ7qPwBr82DxU2MTrjbdaaQvGmbhEQS3FBMhx1wY/sikoQpCzkY3DHxI9dE8LrLTniw1q442lSmhcltkjuk9WhOR+hI/WvXW8SM949bWh1lK0qkRXSCOxUmMCk/oUg/pUU6NJyhBr6o3v3kznJKpJfpf8G+2DxLtq11D0zrDQF40omctCI78tw7vfVtQpbam0FKCf7wKsf1qr/Ga+prjvYlarjzpOl24jKkMx17StveecEE9gsnAP029x2NZnx0pSOIehlhI3FtYJ9SA8j/9NWZxP4g8Jr3rw8KOINhlKdDqQiZNabbitqW2FJUh4OBxGchO4Ad+x7VFJRSpVqcdby08NPcTbTqU5PS0deV9fYrWHw+8OfFCyNwNA3pOl38tSChMp55bxPqgsvOYc7Z/dq7H1I7GydcmJwd8PdvgaptsPiHHt0huMlucyllC0qUotnasOgbE4SPoPSqv47+HLROldGz9WWLVT9tTGbU6iJPcQ63IP91ppQ2qCj6Z35/rWBu2p73qfwVuLvsh6U7b9QNwmJDpJW40lIUnJPnjeU5+AFWlarC8JNrNG6fe0tH5iKyyWZcHZrwbOgGuLukdKcDLHrWXZ0WaHOaCYFmgBJO8lX9mjCUJAGCScAD+eAdPt3igUm0uXfUPDW+Wa2vMrVbZylrcjS3QlSktlwtJCdxTjKd+M9xgE1R/GXmfsl4N9UF+zvZ0jdjOM81G79duK6v8QvsP/d51Hzem9n+yx0mMbN3u8jb6fm2YxVK9OnTUptXvKS8LO3q+FyKEnPJH/VPxv7cyoOLvEn9qXhTu+ovYvsjlXlmLyOq5+dpQrdu2J/j8selRuF3HZzSPBiyW6w6CvmpxaI6xdZjSVsxYhLi1gFwNr77SCcgAZ8zWkWP/AMkN+/8AkyP9Ga6M8NkKK34ZLO0llIRIgylujH5ypxzOf9KvXUKFGrpopLT/AIX5Ip3q1Kab1aa8s39GOlccm9T8EbrqvR2m7rPuLKjDl29pag9DK0El4KQlRKEjuFYHkc7cVUXgt1pqC23aXZI+kLpe4l4uLZm3hCnC3CO0+84Q2oEnz7qTUjwXqP7POKCcnb0KDjPb9y/Wz/7Pr/wnqn/3zP8A9ZrR04UXWilolF+ttPXUo5SnCnd63kvRb+mh0/SlK8k7D+KISkqUQABkk+lfLHWt8f1Nq+76hk55txmOySCfyhaiQn+QBA/SvqBqIPHT9xEf990jvL/xbDj+tfKivU6NX1M5sQ9j6KeFXTTemeB2n0BCQ/cmfaT6gPzl73kZ/k3yx+lWlWA4bhkcO9NCN+4Fpi8v/DyU4/pWfrzqknKbbOiKskhSlKoSKUpQClKUBo/FzhbpTibaWoeoI7jcmPkxZ0chL7OfMAkEFJ9UkEfyPeqQt/g4tiLklyfryZIghXvMsW5LTpHwDhcUAfrtrqelaxupVgbrpqxStSJVKUpWBoSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKA//Z";

const FEATURES = [
    { icon: CheckSquare, title: 'Gestion des tâches', desc: 'Suivi en temps réel des tâches par équipe, département et priorité avec alertes automatiques.' },
    { icon: MessageCircle, title: 'Communication interne', desc: "Messagerie, publications et notifications centralisées pour toute l'entreprise." },
    { icon: Brain, title: 'Intelligence artificielle', desc: 'Analyse émotionnelle, score de santé organisationnelle et alertes prédictives en continu.' },
    { icon: BarChart3, title: 'Analytics avancés', desc: 'Tableaux de bord interactifs, KPIs et rapports détaillés par département.' },
    { icon: Users, title: 'Gestion RH complète', desc: 'Congés, profils employés, organigramme dynamique et évaluation de performance.' },
    { icon: Shield, title: 'Sécurité & conformité', desc: 'Multi-tenant isolé, chiffrement des données, RGPD et audit trail complet.' },
    { icon: Globe, title: 'Multi-entreprises', desc: 'Architecture multi-tenant : chaque entreprise est totalement isolée et sécurisée.' },
    { icon: Layers, title: 'Enquêtes & feedbacks', desc: 'Questionnaires intelligents, boîte à idées et sondages internes avec analyse IA.' },
];

function useIntersection(ref, options = {}) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
        }, { threshold: 0.1, ...options });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return isVisible;
}

function AnimatedSection({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const visible = useIntersection(ref);
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            ...style
        }}>
            {children}
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, index }) {
    const [hov, setHov] = useState(false);
    const ref = useRef(null);
    const visible = useIntersection(ref);
    return (
        <div ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: '28px',
                border: `1px solid ${hov ? 'rgba(37,99,235,0.3)' : 'rgba(37,99,235,0.1)'}`,
                borderRadius: 16,
                background: hov ? 'rgba(37,99,235,0.03)' : '#fff',
                transition: 'all .25s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default',
                boxShadow: hov ? '0 8px 32px rgba(37,99,235,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
                transform: hov ? 'translateY(-3px)' : visible ? 'translateY(0)' : 'translateY(24px)',
                opacity: visible ? 1 : 0,
                transitionDelay: `${index * 60}ms`,
                position: 'relative',
                overflow: 'hidden',
            }}>
            {hov && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #2563eb, #60a5fa)', borderRadius: '16px 16px 0 0' }} />}
            <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: hov ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                transition: 'all .25s ease',
                boxShadow: hov ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
            }}>
                <Icon size={20} color={hov ? '#fff' : '#2563eb'} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 650, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7 }}>{desc}</div>
        </div>
    );
}

function CountUp({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const visible = useIntersection(ref);
    useEffect(() => {
        if (!visible) return;
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        const start = Date.now();
        const timer = setInterval(() => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(num * ease));
            if (progress === 1) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [visible]);
    const prefix = target.match(/^[^0-9]*/)?.[0] || '';
    const rawSuffix = target.match(/[^0-9.]+$/)?.[0] || '';
    return <span ref={ref}>{prefix}{count}{rawSuffix}{suffix}</span>;
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fff; color: #0f172a; overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: .4; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes gradient-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

        .nav-link {
          font-size: 14px; color: #475569; text-decoration: none;
          letter-spacing: -0.01em; transition: color .2s; font-weight: 500;
          position: relative; padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px;
          background: #2563eb; transform: scaleX(0); transition: transform .2s; border-radius: 2px;
        }
        .nav-link:hover { color: #2563eb; }
        .nav-link:hover::after { transform: scaleX(1); }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0 20px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff; font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
          letter-spacing: -0.01em; border: none; cursor: pointer;
          transition: all .2s; box-shadow: 0 2px 8px rgba(37,99,235,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); background: linear-gradient(135deg, #1d4ed8, #1e40af); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0 20px; height: 40px; border-radius: 10px;
          background: #fff; color: #1e40af; font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
          letter-spacing: -0.01em; border: 1.5px solid rgba(37,99,235,0.2); cursor: pointer;
          transition: all .2s;
        }
        .btn-secondary:hover { background: #eff6ff; border-color: #2563eb; transform: translateY(-1px); }

        .btn-lg-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 28px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
          border: none; cursor: pointer; transition: all .25s;
          box-shadow: 0 4px 16px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.1) inset;
          letter-spacing: -0.02em;
        }
        .btn-lg-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.5); }
        .btn-lg-primary:active { transform: translateY(0); }

        .btn-lg-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0 28px; height: 52px; border-radius: 14px;
          background: #fff; color: #1e40af; font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none;
          border: 2px solid rgba(37,99,235,0.2); cursor: pointer; transition: all .25s;
          letter-spacing: -0.02em;
        }
        .btn-lg-secondary:hover { background: #eff6ff; border-color: #2563eb; transform: translateY(-2px); }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 5px; }

        .blue-grid {
          background-image: linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glass-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 4px 24px rgba(37,99,235,0.06);
        }
        .gradient-text {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }
        .hero-blob {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .stat-card {
          background: #fff; border: 1px solid rgba(37,99,235,0.1);
          border-radius: 16px; padding: 20px 28px; text-align: center;
          box-shadow: 0 2px 12px rgba(37,99,235,0.06);
          transition: all .25s; cursor: default;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.25); }
        .testimonial-card {
          padding: 32px; background: #fff; border: 1px solid rgba(37,99,235,0.1);
          border-radius: 20px; transition: all .25s;
          box-shadow: 0 2px 12px rgba(37,99,235,0.04);
        }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(37,99,235,0.1); }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 24px;
          border: 1px solid rgba(37,99,235,0.15); background: rgba(37,99,235,0.05);
          font-size: 12.5px; color: #2563eb; font-weight: 600; letter-spacing: 0.01em;
        }
        .step-card {
          padding: 36px 28px; background: #fff; border: 1px solid rgba(37,99,235,0.1);
          border-radius: 20px; transition: all .3s; position: relative; overflow: hidden;
        }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(37,99,235,0.1); border-color: rgba(37,99,235,0.3); }
        .step-card::before {
          content: attr(data-num); position: absolute; right: 20px; bottom: 12px;
          font-size: 80px; font-weight: 800; color: rgba(37,99,235,0.04);
          line-height: 1; letter-spacing: -0.04em; pointer-events: none;
        }
        .security-row {
          display: flex; align-items: center; gap: 14px; padding: 16px 20px;
          transition: background .2s; border-radius: 10px;
        }
        .security-row:hover { background: #f0f7ff; }
        .logo-img { height: 36px; width: auto; object-fit: contain; }
      `}</style>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
                display: 'flex', alignItems: 'center', padding: '0 24px',
                borderBottom: scrolled ? '1px solid rgba(37,99,235,0.08)' : '1px solid transparent',
                background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                transition: 'all .3s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="CommSight" className="logo-img" />
                        </Link>
                        <div style={{ display: 'flex', gap: 32 }}>
                            {['Fonctionnalités', 'Tarifs', 'Sécurité', 'Contact'].map(l => (
                                <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Link to="/login" className="btn-secondary">Connexion</Link>
                        <Link to="/register" className="btn-primary">
                            Démarrer <ChevronRight size={14} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="blue-grid" style={{
                position: 'relative', minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px', textAlign: 'center', overflow: 'hidden',
            }}>
                {/* Blobs */}
                <div className="hero-blob" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', top: '5%', left: '-10%' }} />
                <div className="hero-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)', top: '20%', right: '-8%', animationDelay: '3s' }} />
                <div className="hero-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)', bottom: '10%', left: '30%', animationDelay: '5s' }} />

                {/* Vignette */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, rgba(255,255,255,0.95) 100%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ animation: 'fadeIn .5s ease both' }}>
                        <div className="badge" style={{ marginBottom: 28 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', display: 'inline-block', animation: 'shimmer 2s ease infinite' }}></span>
                            CommSight v2 avec IA intégrée est disponible
                            <ChevronRight size={12} />
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(44px, 6.5vw, 76px)', fontWeight: 800, color: '#0f172a',
                        lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: 24,
                        animation: 'fadeUp .6s .08s ease both',
                    }}>
                        Gérez votre entreprise.<br />
                        <span className="gradient-text">Livrez plus vite.</span>
                    </h1>

                    <p style={{
                        fontSize: 17, color: '#475569', maxWidth: 540, lineHeight: 1.75,
                        margin: '0 auto 40px', letterSpacing: '-0.01em',
                        animation: 'fadeUp .6s .14s ease both',
                    }}>
                        CommSight unifie communication interne, gestion des tâches et intelligence RH dans une seule plateforme sécurisée et puissante.
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72, animation: 'fadeUp .6s .2s ease both' }}>
                        <Link to="/register" className="btn-lg-primary">
                            Démarrer gratuitement <ArrowRight size={16} strokeWidth={2.5} />
                        </Link>
                        <Link to="/demo" className="btn-lg-secondary">
                            <Play size={15} strokeWidth={2} style={{ fill: '#2563eb' }} />
                            Voir la démo
                        </Link>
                    </div>

                    {/* Stats strip */}
                    <div style={{
                        display: 'inline-grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        border: '1px solid rgba(37,99,235,0.12)',
                        borderRadius: 20, background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(20px)', overflow: 'hidden',
                        animation: 'fadeUp .6s .26s ease both',
                        boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
                    }}>
                        {[
                            { value: '500+', label: 'Entreprises' },
                            { value: '50k+', label: 'Employés actifs' },
                            { value: '99.9%', label: 'Disponibilité' },
                            { value: '4.9★', label: 'Note moyenne' },
                        ].map((s, i, arr) => (
                            <div key={i} className="stat-card" style={{ border: 'none', borderRadius: 0, borderRight: i < arr.length - 1 ? '1px solid rgba(37,99,235,0.08)' : 'none', padding: '22px 34px' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#1e40af', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                    <CountUp target={s.value} />
                                </div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5, letterSpacing: '-0.01em', fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUSTED BY STRIP */}
            <div style={{ borderTop: '1px solid rgba(37,99,235,0.08)', borderBottom: '1px solid rgba(37,99,235,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, background: '#f8faff' }}>
                <span style={{ fontSize: 12.5, color: '#94a3b8', letterSpacing: '-0.01em', marginRight: 24, flexShrink: 0, fontWeight: 500 }}>Utilisé par</span>
                {['TechCorp', 'StartupTN', 'Groupe Lafarge', 'Sonatrach', 'Orange DZ', 'Cevital'].map((name, i) => (
                    <span key={name} style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, padding: '0 20px', borderLeft: '1px solid rgba(37,99,235,0.1)', letterSpacing: '-0.01em' }}>{name}</span>
                ))}
            </div>

            {/* FEATURES */}
            <section id="fonctionnalités" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <AnimatedSection style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div className="badge" style={{ marginBottom: 18 }}>
                        <Sparkles size={12} /> Fonctionnalités
                    </div>
                    <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 16 }}>
                        Tout ce dont votre équipe<br />a besoin.
                    </h2>
                    <p style={{ fontSize: 15.5, color: '#64748b', maxWidth: 500, margin: '0 auto', lineHeight: 1.7, letterSpacing: '-0.01em' }}>
                        Une suite complète d'outils professionnels, alimentée par l'IA, pour les équipes de toutes tailles.
                    </p>
                </AnimatedSection>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
                    {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ borderTop: '1px solid rgba(37,99,235,0.08)', padding: '100px 24px', background: 'linear-gradient(180deg, #f8faff 0%, #eff6ff 100%)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <AnimatedSection style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div className="badge" style={{ marginBottom: 18 }}>En 3 étapes</div>
                        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.08 }}>
                            Opérationnel en moins de<br />10 minutes.
                        </h2>
                    </AnimatedSection>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {[
                            { num: '01', icon: Building2, title: 'Créez votre espace', desc: 'Inscrivez votre entreprise et configurez vos départements en quelques clics. Aucune compétence technique requise.' },
                            { num: '02', icon: Users, title: 'Invitez vos équipes', desc: 'Vos employés reçoivent une invitation par email et créent leur compte sécurisé en moins de 2 minutes.' },
                            { num: '03', icon: TrendingUp, title: 'Analysez & optimisez', desc: "L'IA analyse immédiatement les données et génère vos premiers insights dès la première semaine." },
                        ].map((s, i) => (
                            <AnimatedSection key={s.num} delay={i * 120}>
                                <div className="step-card" data-num={s.num}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                        <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, letterSpacing: '0.08em', background: 'rgba(37,99,235,0.08)', padding: '3px 10px', borderRadius: 6 }}>{s.num}</span>
                                    </div>
                                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                                        <s.icon size={22} color="#2563eb" strokeWidth={1.5} />
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.02em' }}>{s.title}</div>
                                    <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECURITY */}
            <section id="sécurité" style={{ borderTop: '1px solid rgba(37,99,235,0.08)', padding: '100px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                    <AnimatedSection>
                        <div className="badge" style={{ marginBottom: 22 }}>
                            <Shield size={12} /> Sécurité enterprise
                        </div>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 18 }}>
                            Vos données, entièrement<br />isolées et protégées.
                        </h2>
                        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, marginBottom: 32 }}>
                            Architecture multi-tenant avec isolation complète des données. Chaque entreprise dispose de sa propre base de données chiffrée et sécurisée.
                        </p>
                        <div style={{ border: '1px solid rgba(37,99,235,0.1)', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
                            {[
                                { icon: Lock, text: 'Chiffrement AES-256 au repos et en transit' },
                                { icon: Globe, text: 'Hébergement EU conforme RGPD, audit trail complet' },
                                { icon: Clock, text: 'Sauvegardes automatiques toutes les 6 heures' },
                                { icon: Shield, text: 'Isolation totale entre tenants — aucune fuite possible' },
                            ].map((item, i, arr) => (
                                <div key={item.text} className="security-row" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(37,99,235,0.06)' : 'none', borderRadius: 0 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <item.icon size={15} color="#2563eb" strokeWidth={1.5} />
                                    </div>
                                    <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                    <AnimatedSection delay={150}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(37,99,235,0.08)' }}>
                            {[
                                { label: 'Uptime garanti', value: '99.9%', icon: '⚡' },
                                { label: 'Pays desservis', value: '45+', icon: '🌍' },
                                { label: 'Temps de réponse', value: '<80ms', icon: '🚀' },
                                { label: 'Certification', value: 'ISO 27001', icon: '🛡️' },
                            ].map((s, i) => (
                                <div key={s.label} style={{ padding: '40px 28px', borderRight: i % 2 === 0 ? '1px solid rgba(37,99,235,0.08)' : 'none', borderBottom: i < 2 ? '1px solid rgba(37,99,235,0.08)' : 'none', background: i % 2 === 0 ? '#fff' : '#f8faff', transition: 'all .25s' }}>
                                    <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#1e40af', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                                    <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ borderTop: '1px solid rgba(37,99,235,0.08)', padding: '100px 24px', background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <AnimatedSection style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div className="badge" style={{ marginBottom: 18 }}>
                            <Star size={12} style={{ fill: '#2563eb' }} /> Témoignages
                        </div>
                        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: 12 }}>
                            Ils nous font confiance.
                        </h2>
                        <p style={{ fontSize: 15, color: '#94a3b8', fontWeight: 500 }}>Des équipes du monde entier améliorent leur performance avec CommSight.</p>
                    </AnimatedSection>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {[
                            { name: 'Sarah K.', role: 'DRH · TechCorp Maroc', text: "CommSight a transformé notre communication interne. Le module IA détecte les tensions avant qu'elles deviennent des problèmes." },
                            { name: 'Ahmed B.', role: 'CEO · StartupTunisie', text: "Interface intuitive, données isolées, support réactif. Exactement ce dont nous avions besoin pour notre croissance.", featured: true },
                            { name: 'Marie L.', role: 'Manager · Groupe Lafarge', text: "Le tableau de bord analytique nous fait économiser 5h de reporting par semaine. ROI immédiat dès le premier mois." },
                        ].map((t, i) => (
                            <AnimatedSection key={t.name} delay={i * 100}>
                                <div className="testimonial-card" style={t.featured ? { background: 'linear-gradient(135deg, #1e40af, #2563eb)', border: 'none' } : {}}>
                                    <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
                                        {[...Array(5)].map((_, si) => <Star key={si} size={14} color={t.featured ? '#fbbf24' : '#fbbf24'} style={{ fill: '#fbbf24' }} />)}
                                    </div>
                                    <p style={{ fontSize: 14.5, color: t.featured ? 'rgba(255,255,255,0.9)' : '#475569', lineHeight: 1.75, marginBottom: 24 }}>"{t.text}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.featured ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: t.featured ? '2px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: t.featured ? '#fff' : '#2563eb' }}>
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: t.featured ? '#fff' : '#0f172a' }}>{t.name}</div>
                                            <div style={{ fontSize: 12.5, color: t.featured ? 'rgba(255,255,255,0.6)' : '#94a3b8', fontWeight: 500 }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ borderTop: '1px solid rgba(37,99,235,0.08)', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)' }}>
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <AnimatedSection>
                    <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 28 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                            Inscriptions ouvertes — sans carte bancaire
                        </div>
                        <h2 style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.04, marginBottom: 18 }}>
                            Prêt à démarrer ?
                        </h2>
                        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.7, fontWeight: 450 }}>
                            Rejoignez 500+ entreprises qui font confiance à CommSight. Démarrez gratuitement, sans engagement.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', height: 52, borderRadius: 14, background: '#fff', color: '#1e40af', fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em', transition: 'all .25s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}>
                                Démarrer gratuitement <ArrowRight size={15} />
                            </Link>
                            <Link to="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)', letterSpacing: '-0.02em', transition: 'all .25s', backdropFilter: 'blur(10px)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
                                Voir les tarifs
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid rgba(37,99,235,0.08)', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: '#f8faff' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="CommSight" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
                </Link>
                <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>© 2026 CommSight. Tous droits réservés.</p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Confidentialité', 'CGU', 'Contact'].map(l => (
                        <a key={l} href="#" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'color .15s' }}
                            onMouseEnter={e => e.target.style.color = '#2563eb'}
                            onMouseLeave={e => e.target.style.color = '#94a3b8'}>{l}</a>
                    ))}
                </div>
            </footer>
        </>
    );
}