import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { dashboardAPI } from '../services/api';
import {
  CheckCircle, Clock, AlertTriangle, Users,
  FileText, Calendar, BarChart2, TrendingUp,
  Activity,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Palette dynamique ──────────────────────────────────────
  const c = darkMode ? {
    bg: '#0f172a',
    card: '#1e293b',
    cardBorder: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textSub: '#64748b',
    divider: '#334155',
    rowBg: '#0f172a',
    rowBorder: '#334155',
    rowWarnBg: '#3f1212',
    rowWarnBd: '#7f1d1d',
    rowWarnTxt: '#fca5a5',
    completeBg: '#1a2e1a',
    completeBd: '#166534',
    progressBg: '#1e293b',
    statBgBlue: '#1e3a5f',
    statBgCyan: '#0e2936',
    statBgAmber: '#2d1f00',
    statBgGreen: '#0d2618',
    statBgRed: '#2d0f0f',
    bannerBg: '#1e293b',
    bannerBd: '#334155',
  } : {
    bg: '#f1f5f9',
    card: '#fff',
    cardBorder: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    textSub: '#94a3b8',
    divider: '#f1f5f9',
    rowBg: '#f8fafc',
    rowBorder: '#e2e8f0',
    rowWarnBg: '#fef2f2',
    rowWarnBd: '#fecaca',
    rowWarnTxt: '#dc2626',
    completeBg: '#f0fdf4',
    completeBd: '#bbf7d0',
    progressBg: '#f1f5f9',
    statBgBlue: '#eff6ff',
    statBgCyan: '#ecfeff',
    statBgAmber: '#fffbeb',
    statBgGreen: '#f0fdf4',
    statBgRed: '#fef2f2',
    bannerBg: '#fff',
    bannerBd: '#e2e8f0',
  };

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await dashboardAPI.getStats(); setStats(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Sous-composants avec palette ───────────────────────────
  function Card({ children, style = {} }) {
    return (
      <div style={{ background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: 10, ...style }}>
        {children}
      </div>
    );
  }

  function CardTitle({ icon: Icon, color, children }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 14, fontWeight: 700, color: c.text,
        marginBottom: 16, paddingBottom: 12,
        borderBottom: `1px solid ${c.divider}`,
      }}>
        {Icon && <Icon size={16} style={{ color }} />}
        {children}
      </div>
    );
  }

  function StatCard({ title, value, icon: Icon, color, sub }) {
    return (
      <div style={{
        background: c.card, border: `1px solid ${c.cardBorder}`,
        borderTop: `3px solid ${color}`, borderRadius: 10,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
        transition: 'box-shadow .15s', cursor: 'default',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: c.textMuted, fontWeight: 500, marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.text, lineHeight: 1 }}>{value ?? '—'}</div>
          {sub && <div style={{ fontSize: 11, color: c.textSub, marginTop: 3 }}>{sub}</div>}
        </div>
      </div>
    );
  }

  function ProgressRow({ label, val, total, color }) {
    const pct = total > 0 ? Math.min(100, Math.round((val / total) * 100)) : 0;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12.5, color: c.text }}>{label}</span>
          <span style={{ fontSize: 12.5, color: c.textMuted, fontVariantNumeric: 'tabular-nums' }}>
            {val} <span style={{ color: c.textSub }}>({pct}%)</span>
          </span>
        </div>
        <div style={{ height: 7, borderRadius: 4, background: c.progressBg }}>
          <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`, background: color, transition: 'width .65s ease' }} />
        </div>
      </div>
    );
  }

  function StateRow({ label, value, warn }) {
    const isWarn = warn && value > 0;
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 12px',
        background: isWarn ? c.rowWarnBg : c.rowBg,
        border: `1px solid ${isWarn ? c.rowWarnBd : c.rowBorder}`,
        borderRadius: 7, marginBottom: 6,
      }}>
        <span style={{ fontSize: 13, color: c.text }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: isWarn ? c.rowWarnTxt : c.text }}>{value}</span>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ display: 'flex', height: '100vh', background: c.bg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '44px 52px', textAlign: 'center', background: c.card, border: `1px solid ${c.cardBorder}`, borderRadius: 10 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Accès Refusé</div>
              <div style={{ fontSize: 13, color: c.textMuted }}>Réservé aux administrateurs.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const t = stats?.tasks || {};
  const u = stats?.users || {};
  const p = stats?.posts || {};
  const lv = stats?.leaves || {};

  const totalT = t.total ?? 0;
  const doneT = t.by_status?.done ?? 0;
  const inProgT = t.by_status?.in_progress ?? 0;
  const pendingT = t.by_status?.todo ?? 0;
  const overdueT = t.overdue ?? 0;
  const unassignT = t.unassigned ?? 0;
  const totalU = u.total ?? 0;
  const totalP = p.total ?? 0;
  const pendingLv = lv.pending ?? 0;
  const approvedLv = lv.approved ?? 0;

  const completionPct = totalT > 0 ? Math.round((doneT / totalT) * 100) : 0;
  const completionColor = completionPct > 60 ? '#16a34a' : completionPct > 30 ? '#d97706' : '#dc2626';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#94a3b8}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fu .35s ease both}
        .fu2{animation:fu .35s .06s ease both}
        .fu3{animation:fu .35s .12s ease both}
        .fu4{animation:fu .35s .18s ease both}
      `}</style>

      <div style={{ display: 'flex', height: '100vh', background: c.bg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Topbar />

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 32px', background: c.bg }}>

            {/* Header */}
            <div style={{ marginBottom: 18 }} className="fu1">
              <h1 style={{ fontSize: 20, fontWeight: 700, color: c.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={20} style={{ color: '#2563eb' }} />
                Tableau de Bord
              </h1>
              <p style={{ fontSize: 12.5, color: c.textMuted, marginTop: 3 }}>Vue d'ensemble · CommSight</p>
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
                <svg width="40" height="40" viewBox="0 0 44 44" style={{ animation: 'spin .8s linear infinite' }}>
                  <circle cx="22" cy="22" r="18" fill="none" stroke={c.cardBorder} strokeWidth="3" />
                  <path d="M4 22a18 18 0 0118-18" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            ) : (<>

              {/* Row 1 — stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }} className="fu1">
                <StatCard title="Tâches totales" value={totalT} icon={CheckCircle} color="#2563eb" sub={`${doneT} terminées`} />
                <StatCard title="En cours" value={inProgT} icon={Clock} color="#d97706" sub="Actuellement actives" />
                <StatCard title="En retard" value={overdueT} icon={AlertTriangle} color="#dc2626" sub="Action requise" />
                <StatCard title="Employés" value={totalU} icon={Users} color="#7c3aed" sub="Comptes actifs" />
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 14 }} className="fu2">

                <Card style={{ padding: '18px 20px' }}>
                  <CardTitle icon={CheckCircle} color="#2563eb">Répartition des tâches</CardTitle>
                  <ProgressRow label="Terminées" val={doneT} total={totalT} color="#16a34a" />
                  <ProgressRow label="En cours" val={inProgT} total={totalT} color="#d97706" />
                  <ProgressRow label="En attente" val={pendingT} total={totalT} color="#2563eb" />
                  <ProgressRow label="En retard" val={overdueT} total={totalT} color="#dc2626" />
                  <div style={{
                    marginTop: 14, padding: '10px 14px',
                    background: c.rowBg, borderRadius: 8, border: `1px solid ${c.rowBorder}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 12.5, color: c.textMuted, fontWeight: 500 }}>Taux de complétion</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: completionColor }}>{completionPct}%</span>
                  </div>
                </Card>

                <Card style={{ padding: '18px 20px' }}>
                  <CardTitle icon={FileText} color="#0891b2">Communications</CardTitle>
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ fontSize: 44, fontWeight: 700, color: '#0891b2', lineHeight: 1, marginBottom: 6 }}>{totalP}</div>
                    <div style={{ fontSize: 12, color: c.textMuted }}>Publications totales</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: c.statBgCyan, borderRadius: 7, border: `1px solid ${darkMode ? '#164e63' : '#a5f3fc'}`, textAlign: 'center' }}>
                    <span style={{ fontSize: 11.5, color: darkMode ? '#67e8f9' : '#0e7490' }}>Actualités internes actives</span>
                  </div>
                </Card>

                <Card style={{ padding: '18px 20px' }}>
                  <CardTitle icon={Calendar} color="#d97706">Congés</CardTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 13px', borderRadius: 8, background: c.statBgAmber, border: `1px solid ${darkMode ? '#78350f' : '#fed7aa'}` }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>{pendingLv}</div>
                      <div style={{ fontSize: 11.5, color: darkMode ? '#fcd34d' : '#92400e', marginTop: 2 }}>En attente d'approbation</div>
                    </div>
                    <div style={{ padding: '10px 13px', borderRadius: 8, background: c.statBgGreen, border: `1px solid ${darkMode ? '#14532d' : '#bbf7d0'}` }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{approvedLv}</div>
                      <div style={{ fontSize: 11.5, color: darkMode ? '#86efac' : '#14532d', marginTop: 2 }}>Approuvés</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Row 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="fu3">

                <Card style={{ padding: '18px 20px' }}>
                  <CardTitle icon={TrendingUp} color="#2563eb">Statistiques détaillées</CardTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                      { label: 'Employés', value: totalU, color: '#2563eb', bg: c.statBgBlue },
                      { label: 'Publications', value: totalP, color: '#0891b2', bg: c.statBgCyan },
                      { label: 'Congés en attente', value: pendingLv, color: '#d97706', bg: c.statBgAmber },
                      { label: 'Tâches terminées', value: doneT, color: '#16a34a', bg: c.statBgGreen },
                      { label: 'Tâches en retard', value: overdueT, color: '#dc2626', bg: c.statBgRed },
                      { label: 'Tâches en cours', value: inProgT, color: '#d97706', bg: c.statBgAmber },
                    ].map(s => (
                      <div key={s.label} style={{
                        padding: '12px 10px', textAlign: 'center',
                        background: s.bg, borderRadius: 8,
                        border: `1px solid ${s.color}33`,
                      }}>
                        <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: c.textMuted, lineHeight: 1.3 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card style={{ padding: '18px 20px' }}>
                  <CardTitle icon={Activity} color="#7c3aed">État de la plateforme</CardTitle>
                  <StateRow label="Tâches non assignées" value={unassignT} warn={true} />
                  <StateRow label="Congés à valider" value={pendingLv} warn={true} />
                  <StateRow label="Tâches en retard" value={overdueT} warn={true} />
                  <StateRow label="Employés actifs" value={totalU} warn={false} />
                  <StateRow label="Tâches actives totales" value={inProgT + pendingT} warn={false} />
                  <StateRow label="Publications en ligne" value={totalP} warn={false} />
                </Card>
              </div>

              {/* Row 4 — Welcome banner */}
              <Card style={{
                padding: '14px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                borderLeft: '4px solid #2563eb',
              }} className="fu4">
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: '#2563eb', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 700,
                }}>
                  {user?.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: c.text }}>
                    Bonjour, {user?.full_name} 👋
                  </div>
                  <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>
                    Administrateur · CommSight
                  </div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 13px', borderRadius: 20,
                  background: c.statBgGreen,
                  border: `1px solid ${darkMode ? '#166534' : '#86efac'}`,
                  fontSize: 12.5, color: '#16a34a', fontWeight: 500, flexShrink: 0,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 4, background: '#16a34a', display: 'inline-block' }} />
                  Système opérationnel
                </div>
              </Card>

            </>)}
          </div>
        </div>
      </div>
    </>
  );
}