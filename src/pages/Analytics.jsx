// AnalyticsHub.jsx — dark mode ajouté via useApp()
// Seule la structure wrapper (fond, header, onglets) est modifiée.
// Toute la logique ML, les sous-composants et les données restent identiques.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import {
  Brain, ClipboardList, ArrowLeft, RefreshCw, Shield,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle,
  XCircle, AlertCircle, Activity, Target, Zap, Award,
  Users, UserX, Heart,
  MessageSquare, BarChart3, Network, GitBranch, Database,
  Cpu, Clock, Eye, Filter, Lightbulb,
  Hash, Type, Star, ToggleLeft, List,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, ChevronRight,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const token = () => localStorage.getItem('authToken');
const cfg = () => ({ headers: { Authorization: `Bearer ${token()}` } });

// ── Design constants (inchangées) ─────────────────────────────────────────
const RISK = {
  critical: { label: 'Critique', dot: '#ef4444', bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', bar: '#ef4444' },
  high: { label: 'Élevé', dot: '#f97316', bg: '#fff7ed', border: '#fdba74', text: '#9a3412', bar: '#f97316' },
  medium: { label: 'Moyen', dot: '#eab308', bg: '#fefce8', border: '#fde047', text: '#854d0e', bar: '#eab308' },
  low: { label: 'Faible', dot: '#22c55e', bg: '#f0fdf4', border: '#86efac', text: '#166534', bar: '#22c55e' },
};
const SENT = {
  positive: { label: 'Positif', bg: '#f0fdf4', text: '#166534', bar: '#22c55e' },
  neutral: { label: 'Neutre', bg: '#f8fafc', text: '#475569', bar: '#94a3b8' },
  negative: { label: 'Négatif', bg: '#fef2f2', text: '#991b1b', bar: '#ef4444' },
};
const HEALTH_COLOR = (score) => {
  if (score == null) return { text: 'text-gray-400', bar: '#94a3b8', bg: '#f8fafc', label: 'N/A', border: '#e2e8f0' };
  if (score >= 80) return { text: 'text-green-600', bar: '#22c55e', bg: '#f0fdf4', label: 'Excellent', border: '#86efac' };
  if (score >= 65) return { text: 'text-blue-600', bar: '#3b82f6', bg: '#eff6ff', label: 'Bon', border: '#93c5fd' };
  if (score >= 50) return { text: 'text-yellow-600', bar: '#eab308', bg: '#fefce8', label: 'Moyen', border: '#fde047' };
  if (score >= 35) return { text: 'text-orange-600', bar: '#f97316', bg: '#fff7ed', label: 'Insuffisant', border: '#fdba74' };
  return { text: 'text-red-600', bar: '#ef4444', bg: '#fef2f2', label: 'Critique', border: '#fca5a5' };
};
const PRIORITY_META = {
  critical: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444', label: 'Critique' },
  high: { bg: '#fff7ed', text: '#9a3412', border: '#fdba74', dot: '#f97316', label: 'Élevée' },
  medium: { bg: '#fefce8', text: '#854d0e', border: '#fde047', dot: '#eab308', label: 'Moyenne' },
  low: { bg: '#f0fdf4', text: '#166534', border: '#86efac', dot: '#22c55e', label: 'Faible' },
};
const Q_TYPE_META = {
  text: { Icon: Type, label: 'Question ouverte', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  scale: { Icon: Star, label: 'Échelle de notation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  single_choice: { Icon: ToggleLeft, label: 'Choix unique', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  multiple_choice: { Icon: List, label: 'Choix multiples', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
};
const TOPIC_LABELS = {
  charge_travail: 'Charge de travail', management: 'Management', ambiance: 'Ambiance équipe',
  rémunération: 'Rémunération', formation: 'Formation', organisation: 'Organisation',
  bien_etre: 'Bien-être', communication: 'Communication', reconnaissance: 'Reconnaissance',
};
const FEAT_LABELS = {
  task_completion_rate: 'Complétion des tâches', deadline_adherence: 'Respect des délais',
  avg_completion_days: 'Durée moy. complétion', active_task_count: 'Tâches actives',
  blocked_task_count: 'Tâches bloquées', avg_task_priority: 'Priorité moyenne',
  total_messages_30d: 'Messages (30j)', message_velocity_7d: 'Vélocité messages (7j)',
  days_inactive: "Jours d'inactivité", leaves_90d: 'Congés (90j)',
  leave_approval_rate: 'Taux approbation congés', total_leaves: 'Total congés',
  dept_negative_feedback_ratio: 'Feedbacks négatifs dépt.', workload_score: 'Score charge de travail',
};

// ── Utilitaires ────────────────────────────────────────────────────────────
const fmt = (v, d = 1) => v != null ? Number(v).toFixed(d) : '—';
const fmtP = (v, d = 0) => v != null ? `${Number(v).toFixed(d)}%` : '—';
const fmtFrac = (v, d = 0) => v != null ? `${(Number(v) * 100).toFixed(d)}%` : '—';
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v ?? 0));

// ── Composants UI partagés ─────────────────────────────────────────────────
function Panel({ children, className = '' }) {
  return <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>{children}</div>;
}
function PanelHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
function Badge({ children, color = 'gray', small = false }) {
  const map = {
    red: 'bg-red-50 text-red-700 border-red-200', orange: 'bg-orange-50 text-orange-700 border-orange-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200', green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200', purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return <span className={`inline-flex items-center border rounded-md font-medium ${small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'} ${map[color] || map.gray}`}>{children}</span>;
}
function EmptyState({ icon: Icon = CheckCircle, title = 'Aucune donnée', desc = '', green = false, action }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${green ? 'bg-green-100' : 'bg-gray-100'}`}>
        <Icon className={`w-7 h-7 ${green ? 'text-green-600' : 'text-gray-400'}`} />
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      {desc && <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
function Bar({ value, max = 100, color = '#3b82f6', height = 6 }) {
  const w = clamp((value / Math.max(max, 0.001)) * 100, 0, 100);
  return (
    <div className="w-full bg-gray-100 rounded-full overflow-hidden" style={{ height }}>
      <div style={{ width: `${w}%`, height: '100%', background: color, borderRadius: height, transition: 'width .4s ease' }} />
    </div>
  );
}
function MiniBar({ value, max = 100, color = '#3b82f6', label, count }) {
  const w = Math.min(100, Math.round((value / Math.max(max, 0.001)) * 100));
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{label}</span>}
      <div className="flex-1 h-5 bg-gray-100 rounded-md overflow-hidden relative">
        <div style={{ width: `${w}%`, background: color, height: '100%', transition: 'width .4s ease' }} className="rounded-md" />
        <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold" style={{ color: w > 35 ? '#fff' : '#374151' }}>{fmtP(value, 1)}</span>
      </div>
      {count != null && <span className="text-xs text-gray-400 w-8 text-right">{count}</span>}
    </div>
  );
}
function KpiCard({ label, value, sub, icon: Icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-600', valueColor = 'text-gray-900', delta }) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        </div>
        {delta != null && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </Panel>
  );
}
function HealthRing({ score, size = 80 }) {
  const hc = HEALTH_COLOR(score);
  const r = (size - 10) / 2, circ = 2 * Math.PI * r;
  const dash = score != null ? (score / 100) * circ : 0;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={hc.bar} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div className="absolute text-center">
        <p className={`text-lg font-bold leading-none ${hc.text}`}>{score != null ? Math.round(score) : '—'}</p>
        <p className="text-xs text-gray-400">/ 100</p>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function AnalyticsHub() {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const [section, setSection] = useState('ia');

  // Palette dark/light pour le wrapper uniquement
  // (les sous-composants Panel/KpiCard utilisent Tailwind standard)
  const bg = darkMode ? 'bg-slate-900' : 'bg-gray-50';
  const hdr = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const txt = darkMode ? 'text-slate-100' : 'text-gray-900';
  const sub = darkMode ? 'text-slate-400' : 'text-gray-400';
  const tab = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const tabA = darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-600';
  const tabI = darkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-gray-500 hover:text-gray-700';

  if (user?.role !== 'admin') return (
    <div className={`flex h-screen ${bg}`}>
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <EmptyState icon={Shield} title="Accès restreint" desc="Cette section est réservée aux administrateurs." />
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${bg}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Header */}
        <div className={`border-b px-8 py-4 ${hdr}`}>
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className={`text-base font-semibold ${txt}`}>Intelligence Artificielle & Analytics</h1>
              <p className={`text-xs mt-0.5 ${sub}`}>XGBoost · SHAP · Isolation Forest · Prophet · PageRank · NLP Multicouche</p>
            </div>
          </div>
        </div>

        {/* Onglets section */}
        <div className={`border-b px-8 ${tab}`}>
          <div className="max-w-7xl mx-auto flex gap-1">
            {[
              { id: 'ia', label: 'Intelligence Artificielle', Icon: Brain, desc: 'Turnover · Sentiment · Anomalies · Prévisions' },
              { id: 'surveys', label: 'Analyse des Enquêtes', Icon: ClipboardList, desc: 'NLP · Stats avancées · Recommandations IA' },
            ].map(({ id, label, Icon, desc }) => (
              <button key={id} onClick={() => setSection(id)}
                className={`flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${section === id ? tabA : tabI}`}>
                <Icon className="w-4 h-4" /><span>{label}</span>
                <span className={`text-xs hidden lg:block ${section === id ? (darkMode ? 'text-blue-300' : 'text-blue-400') : sub}`}>— {desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {section === 'ia' && <IASection darkMode={darkMode} />}
          {section === 'surveys' && <SurveysSection darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION IA — identique à l'original, dark mode sur le wrapper uniquement
// ═══════════════════════════════════════════════════════════════════════════
function IASection({ darkMode }) {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [exec, setExec] = useState(null);
  const [turnover, setTurnover] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [collab, setCollab] = useState(null);
  const [models, setModels] = useState(null);

  const load = useCallback(async () => {
    const [eR, tR, sR, aR, fR, cR, mR] = await Promise.allSettled([
      axios.get(`${API_URL}/ml/executive-dashboard`, cfg()),
      axios.get(`${API_URL}/ml/turnover/predictions`, cfg()),
      axios.get(`${API_URL}/ml/sentiment/batch-analysis`, cfg()),
      axios.get(`${API_URL}/ml/anomalies`, cfg()),
      axios.get(`${API_URL}/ml/forecast/productivity`, cfg()),
      axios.get(`${API_URL}/ml/collaboration/network`, cfg()),
      axios.get(`${API_URL}/ml/models/status`, cfg()),
    ]);
    if (eR.status === 'fulfilled') setExec(eR.value.data);
    if (tR.status === 'fulfilled') setTurnover(tR.value.data);
    if (sR.status === 'fulfilled') setSentiment(sR.value.data);
    if (aR.status === 'fulfilled') setAnomalies(aR.value.data);
    if (fR.status === 'fulfilled') setForecast(fR.value.data);
    if (cR.status === 'fulfilled') setCollab(cR.value.data);
    if (mR.status === 'fulfilled') setModels(mR.value.data);
    setLastUpdate(new Date());
  }, []);

  useEffect(() => { setLoading(true); load().finally(() => setLoading(false)); }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await axios.post(`${API_URL}/ml/initialize`, {}, cfg()); } catch (_) { }
    await load().catch(() => { });
    setRefreshing(false);
  };

  const IA_TABS = [
    { id: 'overview', label: "Vue d'ensemble", Icon: BarChart3, count: null },
    { id: 'turnover', label: 'Risque turnover', Icon: UserX, count: turnover?.risk_summary ? (turnover.risk_summary.critical + turnover.risk_summary.high) : null },
    { id: 'sentiment', label: 'Sentiment NLP', Icon: MessageSquare, count: sentiment?.summary?.total ?? null },
    { id: 'anomalies', label: 'Anomalies', Icon: AlertTriangle, count: anomalies?.total ?? null },
    { id: 'forecast', label: 'Prévisions', Icon: TrendingUp, count: null },
    { id: 'collaboration', label: 'Réseau', Icon: Network, count: null },
    { id: 'models', label: 'Moteur ML', Icon: Cpu, count: null },
  ];

  const subTabBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100';
  const subTabA = darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600';
  const subTabI = darkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-gray-500 hover:text-gray-700';
  const contentBg = darkMode ? 'bg-slate-900' : '';

  return (
    <div className="flex flex-col h-full">
      <div className={`border-b px-8 flex gap-0 overflow-x-auto flex-shrink-0 ${subTabBg}`}>
        <div className="max-w-7xl mx-auto w-full flex">
          {IA_TABS.map(({ id, label, Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${tab === id ? subTabA : subTabI}`}>
              <Icon className="w-3.5 h-3.5" />{label}
              {count != null && count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === id ? 'bg-blue-100 text-blue-700' : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500')}`}>{count}</span>
              )}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex items-center py-2">
            {lastUpdate && <span className={`text-xs mr-3 hidden lg:block ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Mis à jour {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
            <button onClick={handleRefresh} disabled={refreshing || loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors">
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Analyse…' : 'Réentraîner'}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${contentBg}`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-5" />
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Chargement des modèles ML…</p>
            </div>
          ) : (
            <>
              {tab === 'overview' && <OverviewTab exec={exec} />}
              {tab === 'turnover' && <TurnoverTab data={turnover} />}
              {tab === 'sentiment' && <SentimentTab data={sentiment} />}
              {tab === 'anomalies' && <AnomaliesTab data={anomalies} />}
              {tab === 'forecast' && <ForecastTab data={forecast} />}
              {tab === 'collaboration' && <CollaborationTab data={collab} />}
              {tab === 'models' && <ModelsTab data={models} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tous les sous-composants IA restent identiques à l'original ────────────
// (OverviewTab, TurnoverTab, SentimentTab, AnomaliesTab, ForecastTab,
//  CollaborationTab, ModelsTab, SurveysSection, SurveyList, SurveyDetail,
//  QuestionCard, TextQuestionDetail, ScaleQuestionDetail, ChoiceQuestionDetail,
//  GlobalInsights — tous copiés sans modification ci-dessous)

function OverviewTab({ exec }) {
  if (!exec) return <EmptyState icon={Brain} title="Données non disponibles" desc="Cliquez sur « Réentraîner » pour lancer l'analyse complète." />;
  const health = exec.org_health || {}, tkpi = exec.turnover_kpis || {}, skpi = exec.sentiment_kpis || {};
  const alerts = exec.alerts || [], actions = (exec.priority_actions || []).filter(Boolean);
  const fcast = exec.forecast_summary || {}, critical = exec.critical_anomalies || [];
  const statusMap = {
    excellent: { label: 'Excellent', color: '#16a34a', bg: '#dcfce7' },
    good: { label: 'Bon', color: '#2563eb', bg: '#dbeafe' },
    warning: { label: 'Attention', color: '#d97706', bg: '#fef3c7' },
    critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2' },
  };
  const st = statusMap[health.status] || statusMap.good;
  const breakdownMeta = {
    retention: { label: 'Rétention des talents', icon: Users },
    sentiment: { label: 'Sentiment collaborateurs', icon: Heart },
    behavioral_health: { label: 'Santé comportementale', icon: Activity },
    collaboration: { label: 'Indice collaboration', icon: Network },
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel className="p-5 col-span-2 lg:col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style={{ background: st.color }} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Score santé global</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold" style={{ color: st.color }}>{health.global_score ?? '—'}</span>
            <span className="text-lg text-gray-400 mb-1">/100</span>
          </div>
          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
        </Panel>
        <KpiCard label="Employés à risque de départ" value={tkpi.employees_at_risk ?? 0} sub={`dont ${tkpi.critical_count ?? 0} en risque critique`} icon={UserX} iconBg="bg-red-50" iconColor="text-red-600" valueColor={(tkpi.employees_at_risk ?? 0) > 0 ? 'text-red-600' : 'text-gray-900'} />
        <KpiCard label="NPS Interne" value={`${(skpi.nps_score ?? 0) > 0 ? '+' : ''}${skpi.nps_score ?? 0}`} sub={skpi.nps_interpretation || ''} icon={MessageSquare} iconBg="bg-purple-50" iconColor="text-purple-600" valueColor={(skpi.nps_score ?? 0) > 20 ? 'text-green-600' : (skpi.nps_score ?? 0) > 0 ? 'text-blue-600' : 'text-red-600'} />
        <KpiCard label="Anomalies comportementales" value={critical.length} sub="Isolation Forest" icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-600" valueColor={critical.length > 0 ? 'text-orange-600' : 'text-gray-900'} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {health.breakdown && (
          <Panel>
            <PanelHeader title="Décomposition du score de santé" subtitle="4 dimensions analysées par les modèles ML" />
            <div className="p-6 space-y-4">
              {Object.entries(health.breakdown).map(([key, val]) => {
                const meta = breakdownMeta[key], Icon = meta?.icon || Activity;
                const barColor = val >= 70 ? '#22c55e' : val >= 45 ? '#f97316' : '#ef4444';
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-gray-400" /><span className="text-sm text-gray-700">{meta?.label || key}</span></div>
                      <span className="text-sm font-semibold" style={{ color: barColor }}>{fmt(val)}<span className="text-gray-400 font-normal">/100</span></span>
                    </div>
                    <Bar value={val} max={100} color={barColor} height={7} />
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
        <Panel>
          <PanelHeader title="Alertes actives" subtitle={`${alerts.length} alerte(s)`} />
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {alerts.length === 0 ? <EmptyState icon={CheckCircle} green title="Aucune alerte" desc="Tous les indicateurs sont dans les normes." />
              : alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${a.level === 'critical' ? 'bg-red-50 border-red-100' : a.level === 'high' ? 'bg-orange-50 border-orange-100' : 'bg-yellow-50 border-yellow-100'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.level === 'critical' ? 'bg-red-500' : a.level === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <p className="text-sm text-gray-800 leading-snug flex-1">{a.message}</p>
                  {a.count != null && <span className="text-xs font-bold text-gray-500">{a.count}</span>}
                </div>
              ))
            }
          </div>
        </Panel>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Employés prioritaires — Risque de départ" subtitle="XGBoost + SHAP" />
          <div className="divide-y divide-gray-50">
            {(tkpi.top_3_at_risk || []).length === 0 ? <div className="px-6 py-4"><EmptyState icon={Users} title="Aucun employé à risque élevé" /></div>
              : (tkpi.top_3_at_risk || []).map((e, i) => {
                const r = RISK[e.risk_level] || RISK.low, prob = (e.probability ?? 0) * 100;
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{e.name}</p><p className="text-xs text-gray-400">{e.department}</p></div>
                    <div className="w-28 hidden md:block">
                      <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Prob.</span><span className="font-semibold" style={{ color: r.bar }}>{prob.toFixed(0)}%</span></div>
                      <Bar value={prob} max={100} color={r.bar} height={5} />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold border flex-shrink-0" style={{ background: r.bg, color: r.text, borderColor: r.border }}>{r.label}</span>
                  </div>
                );
              })
            }
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Prévisions Prophet (30j)" subtitle="Tendances prédites" />
          <div className="p-5 space-y-3">
            {Object.keys(fcast).length === 0 ? <EmptyState icon={TrendingUp} title="Aucune prévision" desc="Données insuffisantes." />
              : Object.entries(fcast).map(([metric, d]) => {
                const isUp = d.trend === 'increasing', isDown = d.trend === 'decreasing';
                const metaLabel = { productivity: 'Productivité', sentiment: 'Satisfaction', absenteeism: 'Absentéisme', workload: 'Charge' }[metric] || metric;
                return (
                  <div key={metric} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-700">{metaLabel}</p>{d.next_month_avg != null && <p className="text-xs text-gray-400">Moy. : {fmt(d.next_month_avg)}</p>}</div>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500'}`}>
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      {isUp ? 'Hausse' : isDown ? 'Baisse' : 'Stable'}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </Panel>
      </div>
      {actions.length > 0 && (
        <Panel>
          <PanelHeader title="Plan d'action prioritaire" subtitle="Généré par le moteur ML" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-blue-900 leading-snug">{a}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function TurnoverTab({ data }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  if (!data) return <EmptyState icon={UserX} title="Données turnover non disponibles" desc="Cliquez sur Réentraîner." />;
  const predictions = data.predictions || [], riskSumm = data.risk_summary || {}, modelInfo = data.model_info || {};
  const filtered = filter === 'all' ? predictions : predictions.filter(p => p.ml_prediction?.risk_level === filter);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map(r => {
          const rc = RISK[r], cnt = riskSumm[r] ?? 0;
          return (
            <button key={r} onClick={() => setFilter(filter === r ? 'all' : r)}
              className={`p-5 bg-white rounded-xl border-2 transition-all text-left ${filter === r ? 'shadow-md' : 'hover:border-gray-300'}`}
              style={{ borderColor: filter === r ? rc.dot : '#e5e7eb' }}>
              <div className="flex items-center justify-between mb-2"><div className="w-2 h-2 rounded-full" style={{ background: rc.dot }} /><span className="text-xs font-medium" style={{ color: rc.dot }}>{rc.label}</span></div>
              <p className="text-3xl font-bold text-gray-900">{cnt}</p>
              <p className="text-xs text-gray-400 mt-0.5">employé(s)</p>
            </button>
          );
        })}
      </div>
      <Panel className="px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-500" />{modelInfo.type || 'XGBoost + Calibration'}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-purple-500" />{modelInfo.explainability || 'Rule-based'}</span>
          {modelInfo.features_used && (<><span className="w-px h-3 bg-gray-200" /><span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-green-500" />{modelInfo.features_used.length} features</span></>)}
          <span className="ml-auto text-gray-400">{filtered.length} employé(s) affiché(s)</span>
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="Prédictions individuelles" subtitle="Cliquez pour voir l'explication SHAP"
          action={filter !== 'all' && <button onClick={() => setFilter('all')} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Filter className="w-3 h-3" />Effacer</button>} />
        {filtered.length === 0 ? <div className="p-6"><EmptyState icon={Users} title="Aucun résultat" /></div>
          : <div className="divide-y divide-gray-50">
            {filtered.map((p, i) => {
              const emp = p.employee || {}, pred = p.ml_prediction || {}, expl = p.explainability || {};
              const risk = pred.risk_level || 'low', prob = (pred.turnover_probability ?? 0) * 100, rc = RISK[risk];
              const isOpen = expanded === i;
              return (
                <div key={i}>
                  <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left" onClick={() => setExpanded(isOpen ? null : i)}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: rc.bg, color: rc.text }}>
                      {(emp.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{emp.full_name || '—'}</p><p className="text-xs text-gray-400">{emp.department} · {emp.position}</p></div>
                    <div className="w-32 hidden md:block">
                      <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Risque</span><span className="font-semibold" style={{ color: rc.bar }}>{prob.toFixed(0)}%</span></div>
                      <Bar value={prob} max={100} color={rc.bar} height={5} />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold border flex-shrink-0" style={{ background: rc.bg, color: rc.text, borderColor: rc.border }}>{rc.label}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="mx-6 mb-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {[
                          { title: 'Facteurs de risque (SHAP)', color: 'red', items: expl.top_risk_factors || [], sign: '+' },
                          { title: 'Facteurs protecteurs', color: 'green', items: expl.top_protective_factors || [], sign: '' },
                        ].map(({ title, color, items, sign }) => (
                          <div key={title} className="p-4">
                            <div className="flex items-center gap-1.5 mb-3"><div className={`w-2 h-2 rounded-full bg-${color}-500`} /><p className={`text-xs font-semibold text-${color}-700 uppercase tracking-wide`}>{title}</p></div>
                            {items.length === 0 ? <p className="text-xs text-gray-400">Aucun facteur identifié</p>
                              : items.map((f, j) => (
                                <div key={j} className="mb-2.5">
                                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-600 truncate pr-2">{FEAT_LABELS[f.feature] || f.feature}</span>{f.shap_value != null && <span className={`font-semibold text-${color}-600 flex-shrink-0`}>{sign}{Math.abs(f.shap_value).toFixed(2)}</span>}</div>
                                  {f.message && <p className="text-xs text-gray-400 leading-snug">{f.message}</p>}
                                </div>
                              ))
                            }
                            {expl.explanation_method && <p className="text-xs text-gray-300 mt-3 italic">{expl.explanation_method}</p>}
                          </div>
                        ))}
                        <div className="p-4">
                          <div className="flex items-center gap-1.5 mb-3"><div className="w-2 h-2 rounded-full bg-blue-500" /><p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Actions recommandées</p></div>
                          {(p.recommended_actions || []).length === 0 ? <p className="text-xs text-gray-400">Aucune action requise</p>
                            : (p.recommended_actions || []).map((a, j) => <div key={j} className="flex items-start gap-2 mb-2"><Zap className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" /><p className="text-xs text-gray-700 leading-snug">{a}</p></div>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        }
      </Panel>
    </div>
  );
}

function SentimentTab({ data }) {
  const [activeFilter, setActiveFilter] = useState('all');
  if (!data) return <EmptyState icon={MessageSquare} title="Données sentiment non disponibles" />;
  const summary = data.summary || {}, dist = summary.sentiment_distribution || {}, topics = summary.top_topics || [];
  const nps = data.internal_nps_score ?? null, depts = data.department_breakdown || {}, total = summary.total || 0;
  const pos = Math.round((dist.positive || 0) * 100), neu = Math.round((dist.neutral || 0) * 100), neg = Math.round((dist.negative || 0) * 100);
  const fbs = (data.feedbacks || []).filter(fb => activeFilter === 'all' || (fb.ml_analysis?.label || fb.sentiment) === activeFilter).slice(0, 30);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="NPS Interne" value={`${(nps ?? 0) > 0 ? '+' : ''}${nps ?? '—'}`} sub={data.nps_interpretation || ''} icon={Target} iconBg="bg-purple-50" iconColor="text-purple-600" valueColor={(nps ?? 0) > 20 ? 'text-green-600' : (nps ?? 0) > 0 ? 'text-blue-600' : 'text-red-600'} />
        <KpiCard label="Positifs" value={`${pos}%`} sub={`${Math.round((dist.positive || 0) * total)}/${total}`} icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-600" valueColor="text-green-600" />
        <KpiCard label="Neutres" value={`${neu}%`} sub={`${Math.round((dist.neutral || 0) * total)}/${total}`} icon={Minus} iconBg="bg-gray-50" iconColor="text-gray-500" />
        <KpiCard label="Négatifs" value={`${neg}%`} sub={`${Math.round((dist.negative || 0) * total)}/${total}`} icon={XCircle} iconBg="bg-red-50" iconColor="text-red-600" valueColor={(dist.negative || 0) > 0.3 ? 'text-red-600' : 'text-gray-900'} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <PanelHeader title="Distribution globale" subtitle={`${total} feedback(s) analysés par NLP`} />
          <div className="p-6">
            {total === 0 ? <EmptyState icon={MessageSquare} title="Aucun feedback" /> : (
              <>
                <div className="flex h-8 rounded-lg overflow-hidden gap-0.5 mb-3">
                  {pos > 0 && <div className="flex items-center justify-center text-white text-xs font-bold" style={{ width: `${pos}%`, background: '#22c55e' }}>{pos}%</div>}
                  {neu > 0 && <div className="flex items-center justify-center text-gray-600 text-xs font-bold" style={{ width: `${neu}%`, background: '#e2e8f0' }}>{neu}%</div>}
                  {neg > 0 && <div className="flex items-center justify-center text-white text-xs font-bold" style={{ width: `${neg}%`, background: '#ef4444' }}>{neg}%</div>}
                </div>
                {neg > 30 && <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /><p className="text-xs text-red-700">Taux négatif élevé ({neg}%) — action corrective recommandée.</p></div>}
              </>
            )}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Par département" />
          <div className="p-5 space-y-3">
            {Object.keys(depts).length === 0 ? <EmptyState icon={Users} title="Aucune donnée" />
              : Object.entries(depts).map(([dept, d]) => {
                const t = d.total || 1, dPos = Math.round((d.positive || 0) / t * 100), dNeg = Math.round((d.negative || 0) / t * 100), score = dPos - dNeg;
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{dept}</span>
                      <div className="flex items-center gap-2"><span className="text-xs text-gray-400">{d.total} fdb.</span><span className={`text-xs font-semibold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-500'}`}>NPS {score > 0 ? `+${score}` : score}</span></div>
                    </div>
                    <div className="flex h-4 rounded-md overflow-hidden gap-px">
                      {d.positive > 0 && <div style={{ width: `${dPos}%`, background: '#22c55e' }} />}
                      {d.neutral > 0 && <div style={{ width: `${Math.round((d.neutral || 0) / t * 100)}%`, background: '#e2e8f0' }} />}
                      {d.negative > 0 && <div style={{ width: `${dNeg}%`, background: '#ef4444' }} />}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </Panel>
      </div>
      {topics.length > 0 && (
        <Panel>
          <PanelHeader title="Thèmes récurrents NLP" />
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {topics.map(([word, count], i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{word.replace('_', ' ')}</span>
                <span className="text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
      <Panel>
        <PanelHeader title={`Feedbacks analysés (${fbs.length}/${total})`} subtitle="Sentiment calculé sur le contenu — catégorie ignorée"
          action={<div className="flex gap-1">{['all', 'positive', 'neutral', 'negative'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${activeFilter === f ? f === 'positive' ? 'bg-green-600 text-white' : f === 'negative' ? 'bg-red-600 text-white' : f === 'neutral' ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'Tous' : SENT[f]?.label || f}
            </button>
          ))}</div>} />
        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          {fbs.length === 0 ? <div className="p-6"><EmptyState icon={MessageSquare} title="Aucun feedback" /></div>
            : fbs.map((fb, i) => {
              const ml = fb.ml_analysis || {}, lbl = ml.label || fb.sentiment || 'neutral', sc = SENT[lbl] || SENT.neutral;
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 mt-0.5" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">{fb.content || fb.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {ml.confidence != null && <span className="text-xs text-gray-400">Conf. {(ml.confidence * 100).toFixed(0)}%</span>}
                      {ml.intensity != null && <span className="text-xs text-gray-400">Intensité {(ml.intensity * 100).toFixed(0)}%</span>}
                      {fb.department && <span className="text-xs text-gray-400">{fb.department}</span>}
                      {ml.sarcasm_detected && <span className="text-xs text-orange-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />Sarcasme</span>}
                      {(ml.topics || []).map(t => <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t.replace('_', ' ')}</span>)}
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </Panel>
    </div>
  );
}

function AnomaliesTab({ data }) {
  if (!data) return <EmptyState icon={AlertTriangle} title="Données anomalies non disponibles" />;
  const anomalies = data.anomalies || [], sevSumm = data.severity_summary || {}, modelInfo = data.model_info || {};
  const typeLabels = { behavioral_outlier: { label: 'Comportement inhabituel', icon: Activity }, metric_spike: { label: 'Pic métrique anormal', icon: TrendingUp }, inactivity: { label: 'Inactivité prolongée', icon: Clock }, critical_overload: { label: 'Surcharge critique', icon: Zap }, social_isolation: { label: 'Isolement social', icon: UserX } };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Anomalies totales" value={data.total ?? 0} icon={AlertTriangle} iconBg="bg-orange-50" iconColor="text-orange-600" valueColor={(data.total ?? 0) > 0 ? 'text-orange-600' : 'text-gray-900'} />
        <KpiCard label="Sévérité haute" value={sevSumm.high ?? 0} icon={XCircle} iconBg="bg-red-50" iconColor="text-red-600" valueColor={(sevSumm.high ?? 0) > 0 ? 'text-red-600' : 'text-gray-900'} />
        <KpiCard label="Sévérité moyenne" value={sevSumm.medium ?? 0} icon={AlertCircle} iconBg="bg-yellow-50" iconColor="text-yellow-600" />
      </div>
      <Panel className="px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-500" />{modelInfo.algorithm || 'Isolation Forest'}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>Contamination : {((modelInfo.contamination || 0.05) * 100).toFixed(0)}%</span>
          <span className="w-px h-3 bg-gray-200" />
          <span className={`font-medium ${modelInfo.fitted ? 'text-green-600' : 'text-orange-500'}`}>{modelInfo.fitted ? '● Ajusté' : '○ Non ajusté'}</span>
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="Anomalies détectées" subtitle="Isolation Forest + Z-score + règles métier" />
        {anomalies.length === 0 ? <div className="p-8"><EmptyState icon={CheckCircle} green title="Aucune anomalie détectée" desc="Tous les comportements sont dans les normes statistiques." /></div>
          : <div className="divide-y divide-gray-50">
            {anomalies.map((a, i) => {
              const emp = a.employee || {}, isHigh = a.max_severity === 'high';
              return (
                <div key={i} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${isHigh ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {(emp.full_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div><p className="text-sm font-semibold text-gray-900">{emp.full_name || a.employee_id}</p><p className="text-xs text-gray-400">{emp.department} · {emp.position}</p></div>
                    </div>
                    <div className="flex items-center gap-2"><span className="text-xs text-gray-400">{a.anomaly_count} anomalie(s)</span><Badge color={isHigh ? 'red' : 'orange'}>{isHigh ? 'Sévérité haute' : 'Sévérité moyenne'}</Badge></div>
                  </div>
                  <div className="space-y-2 pl-12">
                    {(a.anomalies || []).map((det, j) => {
                      const tMeta = typeLabels[det.type] || { label: det.type, icon: AlertCircle }, TIcon = tMeta.icon;
                      return (
                        <div key={j} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <TIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap"><span className="text-xs font-semibold text-gray-800">{tMeta.label}</span>{det.z_score != null && <span className="text-xs text-orange-600 font-medium">z={det.z_score}σ</span>}</div>
                            {det.description && <p className="text-xs text-gray-600 mt-0.5 leading-snug">{det.description}</p>}
                            {det.recommended_action && <p className="text-xs text-blue-700 mt-1.5 flex items-center gap-1"><Zap className="w-3 h-3" />{det.recommended_action}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </Panel>
    </div>
  );
}

function ForecastTab({ data: initialData }) {
  const [metric, setMetric] = useState('productivity'), [data, setData] = useState(initialData), [loading, setLoading] = useState(false);
  const switchMetric = async (m) => { setMetric(m); if (m === 'productivity' && initialData) { setData(initialData); return; } setLoading(true); try { const r = await axios.get(`${API_URL}/ml/forecast/${m}`, cfg()); setData(r.data); } catch (_) { setData(null); } setLoading(false); };
  const METRICS = [{ id: 'productivity', label: 'Productivité', icon: Target }, { id: 'sentiment', label: 'Satisfaction', icon: Heart }, { id: 'absenteeism', label: 'Absentéisme', icon: UserX }, { id: 'workload', label: 'Charge travail', icon: Activity }];
  const forecast = data?.forecast || [], trend = data?.trend || {}, nextM = data?.next_month_summary || {}, modelI = data?.model_info || {}, histPoints = data?.historical_data_points ?? 0, trendDir = trend.direction || 'stable';
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {METRICS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => switchMetric(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${metric === id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Tendance prévue" value={trendDir === 'increasing' ? '↑ Hausse' : trendDir === 'decreasing' ? '↓ Baisse' : '→ Stable'} icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600" valueColor={trendDir === 'increasing' ? 'text-green-600' : trendDir === 'decreasing' ? 'text-red-600' : 'text-gray-700'} />
        <KpiCard label="Moyenne prévue (30j)" value={nextM.predicted_avg != null ? fmt(nextM.predicted_avg) : '—'} icon={Target} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <KpiCard label="Méthode active" value={modelI.active?.split(' ')[0] || 'Prophet'} sub="+ ARIMA fallback" icon={Brain} iconBg="bg-green-50" iconColor="text-green-600" />
        <KpiCard label="Points historiques" value={histPoints} sub="jours de données" icon={Clock} iconBg="bg-gray-50" iconColor="text-gray-500" valueColor={histPoints >= 14 ? 'text-gray-900' : 'text-orange-600'} />
      </div>
      <Panel>
        <PanelHeader title={`Prévisions — ${METRICS.find(m => m.id === metric)?.label || metric}`} subtitle={`${modelI.primary || 'Prophet'} · Horizon 30j · IC 95%`} />
        {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          : forecast.length === 0 ? <div className="p-6"><EmptyState icon={TrendingUp} title="Prévisions indisponibles" desc="Minimum 14 jours de données historiques requis." /></div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100"><tr>{['Date', 'Prévision', 'IC inf. 95%', 'IC sup. 95%', 'Tend.'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {forecast.map((f, i) => {
                      const val = f.predicted ?? 0, prevVal = i > 0 ? (forecast[i - 1].predicted ?? 0) : val;
                      const dir = val > prevVal * 1.02 ? 'up' : val < prevVal * 0.98 ? 'down' : 'flat';
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-gray-600 font-medium">{new Date(f.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</td>
                          <td className="px-5 py-3 font-bold text-gray-900">{fmt(val)}</td>
                          <td className="px-5 py-3 text-gray-400">{fmt(f.lower_95 ?? 0)}</td>
                          <td className="px-5 py-3 text-gray-400">{fmt(f.upper_95 ?? 0)}</td>
                          <td className="px-5 py-3">{dir === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> : dir === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 text-gray-400" />}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
        }
      </Panel>
    </div>
  );
}

function CollaborationTab({ data }) {
  if (!data) return <EmptyState icon={Network} title="Données réseau non disponibles" />;
  const nodes = data.nodes || [], metrics = data.metrics || {}, isolated = data.isolated_employees || [], keyInfl = data.key_influencers || [], silos = data.department_silos || [], modelI = data.model_info || {};
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Densité du réseau" value={`${fmt(metrics.network_density ?? 0)}%`} icon={Network} iconBg="bg-blue-50" iconColor="text-blue-600" valueColor={(metrics.network_density ?? 0) > 30 ? 'text-green-600' : (metrics.network_density ?? 0) > 15 ? 'text-blue-600' : 'text-orange-600'} />
        <KpiCard label="Collab. inter-depts" value={`${fmt(metrics.cross_dept_ratio ?? 0)}%`} icon={GitBranch} iconBg="bg-purple-50" iconColor="text-purple-600" valueColor={(metrics.cross_dept_ratio ?? 0) > 25 ? 'text-green-600' : 'text-gray-900'} />
        <KpiCard label="Connexions moyennes" value={fmt(metrics.avg_degree ?? 0, 1)} icon={Users} iconBg="bg-green-50" iconColor="text-green-600" />
        <KpiCard label="Employés isolés" value={isolated.length} icon={UserX} iconBg="bg-red-50" iconColor="text-red-600" valueColor={isolated.length > 0 ? 'text-red-600' : 'text-gray-900'} />
      </div>
      <Panel className="px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-blue-500" />{modelI.algorithm || 'PageRank (5 itérations)'}</span>
          <span className="w-px h-3 bg-gray-200" /><span>{nodes.length} nœuds · {data.edges?.length ?? 0} arêtes</span>
        </div>
      </Panel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel>
          <PanelHeader title="Influenceurs clés" subtitle="Score PageRank" />
          <div className="divide-y divide-gray-50">
            {keyInfl.slice(0, 6).map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{i + 1}</div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{(n.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{n.name}</p><p className="text-xs text-gray-400">{n.department}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-blue-600">{(n.pagerank ?? 0).toFixed(4)}</p><p className="text-xs text-gray-400">{n.degree ?? 0} conn.</p></div>
                {n.is_bridge && <Badge color="purple">Pont</Badge>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Silos départementaux" />
          <div className="p-5">
            {silos.length === 0 ? <EmptyState icon={CheckCircle} green title="Aucun silo" desc="Bonne interconnexion entre tous les départements." />
              : <div className="space-y-3">{silos.map((s, i) => (
                <div key={i} className={`p-4 rounded-xl border ${s.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-start justify-between mb-2"><div><p className="text-sm font-semibold text-gray-900">{s.department}</p><p className="text-xs text-gray-500">{s.employee_count} employé(s)</p></div><Badge color={s.severity === 'high' ? 'red' : 'orange'}>{(s.cross_dept_ratio * 100).toFixed(0)}% ext.</Badge></div>
                  {s.recommendation && <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-700"><Zap className="w-3 h-3 flex-shrink-0" />{s.recommendation}</div>}
                </div>
              ))}</div>
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ModelsTab({ data }) {
  if (!data) return <EmptyState icon={Cpu} title="Statut non disponible" />;
  const mods = data.models || {}, libs = data.libraries || {}, cache = data.cache_status || {};
  const modelCards = [
    { key: 'turnover_predictor', title: 'Prédiction Turnover', algo: mods.turnover_predictor?.name || 'XGBoost', icon: UserX, active: mods.turnover_predictor?.is_trained, chips: [`${mods.turnover_predictor?.n_features || 0} features`, mods.turnover_predictor?.has_shap ? 'SHAP ✓' : 'SHAP ✗'], desc: 'Prédit la probabilité de départ avec explainabilité SHAP.' },
    { key: 'sentiment_analyzer', title: 'Analyseur Sentiment', algo: mods.sentiment_analyzer?.name || 'VADER+TF-IDF+SVC', icon: MessageSquare, active: mods.sentiment_analyzer?.has_vader, chips: ['VADER ✓', 'Lexique RH ✓', mods.sentiment_analyzer?.is_ml_trained ? 'SVM ✓' : 'SVM ✗'], desc: 'Analyse le contenu textuel — catégorie ignorée.' },
    { key: 'survey_nlp_engine', title: 'NLP Enquêtes', algo: mods.survey_nlp_engine?.name || 'VADER+FR+TF-IDF', icon: ClipboardList, active: mods.survey_nlp_engine?.is_available, chips: ['VADER+FR ✓', 'TF-IDF ✓', 'Stats avancées ✓'], desc: 'Moteur dédié aux enquêtes.' },
    { key: 'anomaly_detector', title: "Détecteur d'Anomalies", algo: mods.anomaly_detector?.name || 'Isolation Forest', icon: AlertTriangle, active: mods.anomaly_detector?.is_fitted, chips: [`Contamination: ${((mods.anomaly_detector?.contamination || 0.05) * 100).toFixed(0)}%`], desc: 'Détecte les comportements statistiquement anormaux.' },
    { key: 'forecaster', title: 'Prévisions Temporelles', algo: mods.forecaster?.name || 'Facebook Prophet', icon: TrendingUp, active: true, chips: [mods.forecaster?.prophet_available ? 'Prophet ✓' : 'Prophet ✗', 'ARIMA fallback ✓'], desc: 'Prévisions 30–180j avec intervalles de confiance 95%.' },
    { key: 'collaboration_analyzer', title: 'Analyse Réseau', algo: mods.collaboration_analyzer?.name || 'PageRank', icon: Network, active: true, chips: ['PageRank ✓', 'Silos ✓'], desc: 'Cartographie réseau, influenceurs et silos départementaux.' },
  ];
  const libList = [
    { key: 'xgboost', label: 'XGBoost', desc: 'Gradient boosting — turnover' },
    { key: 'sklearn', label: 'scikit-learn', desc: 'Isolation Forest, TF-IDF, SVM' },
    { key: 'shap', label: 'SHAP', desc: 'Explainabilité prédictions' },
    { key: 'prophet', label: 'Prophet', desc: 'Prévisions temporelles Facebook' },
    { key: 'nltk', label: 'NLTK / VADER', desc: 'NLP, analyse de sentiment' },
    { key: 'vaderSentiment', label: 'vaderSentiment', desc: 'Moteur NLP enquêtes (FR)' },
  ];
  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader title="Bibliothèques ML installées" subtitle="Dépendances du moteur IA" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {libList.map(({ key, label, desc }) => {
            const ok = libs[key];
            return (
              <div key={key} className={`flex items-start gap-3 p-4 rounded-xl border ${ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-100' : 'bg-red-100'}`}>
                  {ok ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div><p className={`text-sm font-semibold ${ok ? 'text-green-900' : 'text-red-900'}`}>{label}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
              </div>
            );
          })}
        </div>
        {Object.values(libs).some(v => !v) && (
          <div className="mx-5 mb-5 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm font-medium text-orange-900 mb-1">Librairies manquantes</p>
            <p className="text-xs text-orange-700 font-mono bg-orange-100 px-3 py-2 rounded-lg">pip install xgboost scikit-learn shap nltk prophet vaderSentiment numpy</p>
          </div>
        )}
      </Panel>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelCards.map(({ key, title, algo, icon: Icon, active, chips, desc }) => (
          <Panel key={key} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-blue-50' : 'bg-gray-100'}`}><Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} /></div>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${active ? 'text-green-600' : 'text-red-500'}`}><div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-400'}`} />{active ? 'Actif' : 'Inactif'}</div>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h4>
            <p className="text-xs text-gray-400 mb-3">{algo}</p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">{desc}</p>
            <div className="flex flex-wrap gap-1.5">{chips.map((c, i) => <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">{c}</span>)}</div>
          </Panel>
        ))}
      </div>
      <Panel>
        <PanelHeader title="Cache & performances" />
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Analyses en cache', value: cache.cached_analyses ?? 0 },
            { label: 'TTL du cache', value: cache.ttl_seconds ? `${cache.ttl_seconds / 60} min` : '—' },
            { label: 'Dernière vérif.', value: data.checked_at ? new Date(data.checked_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—' },
            { label: 'Modèles actifs', value: `${modelCards.filter(m => m.active).length} / ${modelCards.length}` },
          ].map(({ label, value }) => (
            <div key={label}><p className="text-xs text-gray-400 mb-0.5">{label}</p><p className="text-lg font-bold text-gray-900">{value}</p></div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── SurveysSection et ses sous-composants (identiques à l'original) ────────
function SurveysSection({ darkMode }) {
  const [view, setView] = useState('list'), [surveys, setSurveys] = useState([]), [selected, setSelected] = useState(null), [globalData, setGlobalData] = useState(null), [loading, setLoading] = useState(true), [detailLoad, setDetailLoad] = useState(false), [error, setError] = useState(null);
  const hdr = darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-100 text-gray-900';
  const sub2 = darkMode ? 'text-slate-400' : 'text-gray-400';
  const loadSurveys = useCallback(async () => { try { const r = await axios.get(`${API_URL}/ml/surveys`, cfg()); setSurveys(r.data?.surveys || []); setError(null); } catch { setError('Impossible de charger les enquêtes.'); } }, []);
  const loadGlobal = async () => { setLoading(true); try { const r = await axios.get(`${API_URL}/ml/surveys/global-insights`, cfg()); setGlobalData(r.data); setView('global'); } catch { setError('Impossible de charger les insights globaux.'); } setLoading(false); };
  const loadDetail = async (id) => { setDetailLoad(true); setError(null); try { const r = await axios.get(`${API_URL}/ml/surveys/${id}/analysis`, cfg()); setSelected(r.data); setView('detail'); } catch { setError('Analyse ML indisponible pour cette enquête.'); } setDetailLoad(false); };
  const goBack = () => { setView('list'); setSelected(null); setGlobalData(null); setError(null); };
  useEffect(() => { setLoading(true); loadSurveys().finally(() => setLoading(false)); }, [loadSurveys]);
  return (
    <div className="flex flex-col h-full">
      <div className={`border-b px-8 py-3 flex items-center justify-between flex-shrink-0 ${hdr}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== 'list' && <button onClick={goBack} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><ArrowLeft className="w-4 h-4 text-gray-500" /></button>}
            <div>
              <p className="text-sm font-semibold">{view === 'list' ? `${surveys.length} enquête(s) disponible(s)` : view === 'global' ? 'Insights globaux cross-enquêtes' : selected?.survey?.title || 'Analyse détaillée'}</p>
              {view === 'detail' && selected && <p className={`text-xs ${sub2}`}>{selected.total_responses} réponse(s) · Score {selected.overall_health_score != null ? `${Math.round(selected.overall_health_score)}/100` : 'N/A'}{selected.cronbach_alpha != null && ` · α Cronbach : ${selected.cronbach_alpha}`}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {view === 'list' && <button onClick={loadGlobal} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"><BarChart3 className="w-3.5 h-3.5" />Vue globale</button>}
            <button onClick={() => { setLoading(true); loadSurveys().finally(() => setLoading(false)); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-lg text-xs font-medium transition-colors"><RefreshCw className="w-3.5 h-3.5" />Actualiser</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {error && <div className="mb-5 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><XCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
          {loading || detailLoad ? <div className="flex flex-col items-center justify-center py-32"><div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" /><p className="text-sm text-gray-500 font-medium">{detailLoad ? 'Analyse NLP en cours…' : 'Chargement des enquêtes…'}</p></div> : (
            <>
              {view === 'list' && <SurveyList surveys={surveys} onSelect={loadDetail} />}
              {view === 'detail' && selected && <SurveyDetail data={selected} />}
              {view === 'global' && globalData && <GlobalInsights data={globalData} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SurveyList({ surveys, onSelect }) {
  if (surveys.length === 0) return <EmptyState icon={ClipboardList} title="Aucune enquête disponible" desc="Créez des enquêtes depuis le tableau de bord pour les analyser ici." />;
  return (
    <div className="space-y-4">
      {surveys.map(s => {
        const hc = HEALTH_COLOR(s.ml_health_score), nps = s.ml_nps;
        return (
          <Panel key={s.id} className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => onSelect(s.id)}>
            <div className="p-5">
              <div className="flex items-start gap-4">
                <HealthRing score={s.ml_health_score} size={64} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{s.title}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge color={s.status === 'active' ? 'green' : 'gray'} small>{s.status === 'active' ? 'Active' : 'Clôturée'}</Badge>
                      {s.anonymous && <Badge color="purple" small>Anonyme</Badge>}
                    </div>
                  </div>
                  {s.description && <p className="text-xs text-gray-400 mb-2 line-clamp-2">{s.description}</p>}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3 h-3" />{s.total_responses} réponse(s)</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Hash className="w-3 h-3" />{s.question_count} question(s)</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Filter className="w-3 h-3" />{s.target_department === 'all' ? 'Tous les depts.' : s.target_department}</span>
                    {s.deadline && <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{new Date(s.deadline).toLocaleDateString('fr-FR')}</span>}
                    <div className="flex gap-1">{s.has_text_questions && <Badge color="purple" small>Texte</Badge>}{s.has_scale_questions && <Badge color="blue" small>Échelle</Badge>}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right hidden md:block">
                  <p className="text-xs text-gray-400">Score santé ML</p>
                  <p className={`text-lg font-bold ${hc.text}`}>{s.ml_health_score != null ? `${Math.round(s.ml_health_score)}/100` : 'N/A'}</p>
                  <p className={`text-xs font-medium ${hc.text}`}>{hc.label}</p>
                  {nps != null && <div className="mt-1"><p className="text-xs text-gray-400">NPS texte</p><p className={`text-sm font-bold ${nps > 0 ? 'text-green-600' : nps < 0 ? 'text-red-600' : 'text-gray-600'}`}>{nps > 0 ? `+${nps}` : nps}</p></div>}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

function SurveyDetail({ data }) {
  const [expandedQ, setExpandedQ] = useState(null);
  const survey = data.survey || {}, qs = data.questions_analysis || [], depts = data.department_breakdown || {}, recs = data.recommendations || [];
  const total = data.total_responses || 0, health = data.overall_health_score, hc = HEALTH_COLOR(health), cronbach = data.cronbach_alpha;
  return (
    <div className="space-y-6">
      <Panel>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <HealthRing score={health} size={96} />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{survey.title}</h2>
              {survey.description && <p className="text-sm text-gray-500 mb-3">{survey.description}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ label: 'Réponses totales', value: total, icon: Users }, { label: 'Questions', value: qs.length, icon: Hash }, { label: 'Score santé', value: health != null ? `${Math.round(health)}/100` : '—', icon: Activity, color: hc.text }, { label: 'Niveau', value: hc.label, icon: Award, color: hc.text }].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1"><Icon className="w-3.5 h-3.5 text-gray-400" /><p className="text-xs text-gray-400">{label}</p></div>
                    <p className={`text-xl font-bold ${color || 'text-gray-900'}`}>{value}</p>
                  </div>
                ))}
              </div>
              {cronbach != null && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <Brain className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div><p className="text-xs font-semibold text-blue-900">Alpha de Cronbach : {cronbach}</p><p className="text-xs text-blue-700 mt-0.5">{cronbach >= 0.9 ? 'Cohérence interne excellente' : cronbach >= 0.8 ? 'Bonne cohérence interne' : cronbach >= 0.7 ? 'Cohérence acceptable' : cronbach >= 0.6 ? 'Cohérence questionnable — revoir les échelles' : 'Cohérence faible — échelles peu fiables'}</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
      {recs.length > 0 && (
        <Panel>
          <PanelHeader title="Recommandations générées par le moteur ML" subtitle="Basées sur l'analyse NLP et les statistiques d'échelle" icon={Zap} />
          <div className="p-5 space-y-2">
            {recs.map((r, i) => {
              const pm = PRIORITY_META[r.priority] || PRIORITY_META.medium; return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: pm.bg, borderColor: pm.border }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: pm.dot }} />
                  <div className="flex-1"><div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-xs font-semibold px-2 py-0.5 rounded-md border" style={{ background: '#fff', color: pm.text, borderColor: pm.border }}>{pm.label}</span><span className="text-xs text-gray-500">{r.question}</span></div><p className="text-sm font-medium mb-0.5" style={{ color: pm.text }}>{r.insight}</p><p className="text-xs text-gray-600 flex items-center gap-1"><ChevronRight className="w-3 h-3 flex-shrink-0" />{r.action}</p></div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
      {Object.keys(depts).length > 0 && (
        <Panel>
          <PanelHeader title="Résultats par département" icon={Users} subtitle="Score de santé ML" />
          <div className="p-5 space-y-3">
            {Object.entries(depts).sort((a, b) => (b[1].health_score ?? 0) - (a[1].health_score ?? 0)).map(([dept, d]) => {
              const dhc = HEALTH_COLOR(d.health_score); return (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1.5"><span className="text-sm font-medium text-gray-700">{dept}</span><div className="flex items-center gap-3"><span className="text-xs text-gray-400">{d.count} rép.</span><span className={`text-sm font-bold ${dhc.text}`}>{d.health_score != null ? `${Math.round(d.health_score)}/100` : '—'}</span><Badge color={d.health_score >= 65 ? 'green' : d.health_score >= 50 ? 'blue' : d.health_score >= 35 ? 'yellow' : 'red'} small>{dhc.label}</Badge></div></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(d.health_score ?? 0, 100)}%`, background: dhc.bar, transition: 'width .5s ease' }} /></div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Analyse détaillée — {qs.length} question(s)</h3>
        {qs.map((qa, i) => <QuestionCard key={i} qa={qa} index={i} expanded={expandedQ === i} onToggle={() => setExpandedQ(expandedQ === i ? null : i)} />)}
      </div>
    </div>
  );
}

function QuestionCard({ qa, index, expanded, onToggle }) {
  const qType = qa.type || 'text', qMeta = Q_TYPE_META[qType] || Q_TYPE_META.text, QIcon = qMeta.Icon;
  return (
    <Panel>
      <button className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors" onClick={onToggle}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${qMeta.bg} border ${qMeta.border}`}><QIcon className={`w-4 h-4 ${qMeta.color}`} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap"><span className="text-xs font-semibold text-gray-400">Q{index + 1}</span><Badge color={qType === 'text' ? 'purple' : qType === 'scale' ? 'blue' : 'green'} small>{qMeta.label}</Badge><span className="text-xs text-gray-400">{qa.response_count} rép. · {fmtP(qa.response_rate)} participation</span></div>
          <p className="text-sm font-medium text-gray-900 leading-snug">{qa.label}</p>
          <QuestionSummary qa={qa} />
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>
      {expanded && (
        <div className="border-t border-gray-100">
          {qa.type === 'text' && <TextQuestionDetail qa={qa} />}
          {qa.type === 'scale' && <ScaleQuestionDetail qa={qa} />}
          {(qa.type === 'single_choice' || qa.type === 'multiple_choice') && <ChoiceQuestionDetail qa={qa} />}
        </div>
      )}
    </Panel>
  );
}

function QuestionSummary({ qa }) {
  if (qa.ml_analysis) {
    const dist = qa.ml_analysis.sentiment_distribution || {}, nps = qa.ml_analysis.nps_score;
    const pos = Math.round((dist.positive || 0) * 100), neg = Math.round((dist.negative || 0) * 100), neu = Math.round((dist.neutral || 0) * 100);
    return (<div className="flex items-center gap-3 mt-1.5"><div className="flex h-2 w-28 rounded-full overflow-hidden gap-px">{pos > 0 && <div style={{ width: `${pos}%`, background: '#22c55e' }} />}{neu > 0 && <div style={{ width: `${neu}%`, background: '#94a3b8' }} />}{neg > 0 && <div style={{ width: `${neg}%`, background: '#ef4444' }} />}</div><span className={`text-xs font-semibold ${nps > 0 ? 'text-green-600' : nps < 0 ? 'text-red-600' : 'text-gray-500'}`}>NPS {nps > 0 ? `+${nps}` : nps}</span><span className="text-xs text-gray-400 truncate">{qa.ml_analysis.interpretation?.split(' — ')[0]}</span></div>);
  }
  if (qa.stats) {
    const s = qa.stats, hc = HEALTH_COLOR(s.normalized_score);
    return (<div className="flex items-center gap-3 mt-1.5"><span className={`text-xs font-bold ${hc.text}`}>{fmt(s.mean)}/{s.max_scale}</span><span className="text-xs text-gray-400">moy. · σ={fmt(s.std_dev)}</span><Badge color={s.benchmark_color || 'gray'} small>{s.benchmark_label}</Badge>{s.skewness != null && <span className="text-xs text-gray-400">asymétrie={fmt(s.skewness, 2)}</span>}</div>);
  }
  if (qa.distribution) {
    return (<div className="flex items-center gap-2 mt-1.5"><span className="text-xs text-gray-500">Dominant :</span><span className="text-xs font-semibold text-gray-800 truncate max-w-xs">{qa.dominant_option}</span><span className="text-xs text-gray-400">({fmtP(qa.dominance_pct)})</span><Badge color={qa.consensus === 'Forte' ? 'green' : qa.consensus === 'Modérée' ? 'yellow' : 'gray'} small>Consensus {qa.consensus}</Badge></div>);
  }
  return null;
}

function TextQuestionDetail({ qa }) {
  const ml = qa.ml_analysis || {}, dist = ml.sentiment_distribution || {}, topics = ml.top_topics || [], keywords = ml.top_keywords || [], reps = ml.responses_detail || [], stats = ml.stats || {}, total = qa.response_count || 1;
  const pos = Math.round((dist.positive || 0) * 100), neu = Math.round((dist.neutral || 0) * 100), neg = Math.round((dist.negative || 0) * 100);
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl"><HealthRing score={ml.health_score} size={80} /><p className="text-xs text-gray-500 mt-2 text-center">Score de santé NLP</p>{stats.avg_score != null && <p className="text-xs text-gray-400 mt-1">Score moy. : {fmt(stats.avg_score, 3)}</p>}</div>
        <div className="col-span-2 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Distribution du sentiment</p>
          {[{ key: 'positive', label: 'Positif', pct: pos, color: '#22c55e' }, { key: 'neutral', label: 'Neutre', pct: neu, color: '#94a3b8' }, { key: 'negative', label: 'Négatif', pct: neg, color: '#ef4444' }].map(s => <MiniBar key={s.key} value={s.pct} max={100} color={s.color} label={s.label} count={Math.round((dist[s.key] || 0) * total)} />)}
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100 flex-wrap gap-2">
            <span className="text-gray-500">NPS interne : <strong className={ml.nps_score > 0 ? 'text-green-600' : 'text-red-600'}>{ml.nps_score > 0 ? `+${ml.nps_score}` : ml.nps_score}</strong></span>
            <span className="text-gray-500">Intensité moy. : <strong>{fmtP((ml.avg_intensity || 0) * 100)}</strong></span>
            {ml.sarcasm_count > 0 && <span className="text-orange-600 font-medium">{ml.sarcasm_count} sarcasme(s) détecté(s)</span>}
            {stats.std_score != null && <span className="text-gray-400">σ scores={fmt(stats.std_score, 3)}</span>}
          </div>
        </div>
      </div>
      {ml.interpretation && (<div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl"><Brain className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-indigo-900">{ml.interpretation}</p></div>)}
      {(topics.length > 0 || keywords.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.length > 0 && (<div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thèmes RH détectés</p><div className="flex flex-wrap gap-2">{topics.map(([t, cnt], i) => <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg"><Lightbulb className="w-3 h-3 text-blue-600" /><span className="text-xs font-medium text-blue-900">{TOPIC_LABELS[t] || t}</span><span className="text-xs text-blue-400 bg-blue-100 px-1 rounded-full">{cnt}</span></div>)}</div></div>)}
          {keywords.length > 0 && (<div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mots-clés TF-IDF</p><div className="flex flex-wrap gap-1.5">{keywords.slice(0, 10).map(([word, score], i) => <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-xs font-medium text-purple-800">{word}<span className="text-purple-400 text-xs">{typeof score === 'number' ? fmt(score, 2) : score}</span></span>)}</div></div>)}
        </div>
      )}
      {reps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Réponses analysées ({reps.length} les plus significatives)</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {reps.map((r, i) => { const sc = SENT[r.sentiment] || SENT.neutral; return (<div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span><p className="text-sm text-gray-700 flex-1 leading-relaxed">{r.text}</p><div className="flex flex-col items-end gap-1 flex-shrink-0"><span className="text-xs text-gray-400">{fmtP((r.confidence || 0) * 100, 0)} conf.</span>{r.sarcasm && <span className="text-xs text-orange-500 font-medium">Sarcasme</span>}</div></div>); })}
          </div>
        </div>
      )}
    </div>
  );
}

function ScaleQuestionDetail({ qa }) {
  const s = qa.stats || {}, hc = HEALTH_COLOR(s.normalized_score), vd = s.value_distribution || {}, maxCount = Math.max(...Object.values(vd), 1), pct = s.value_distribution_pct || {}, percentiles = s.percentiles || {};
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Moyenne', value: fmt(s.mean), unit: `/${s.max_scale}` }, { label: 'Médiane', value: fmt(s.median), unit: `/${s.max_scale}` }, { label: 'Mode', value: s.mode != null ? `${s.mode}/${s.max_scale}` : '—', unit: '' }, { label: 'Écart-type', value: fmt(s.std_dev), unit: '' }].map(({ label, value, unit }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{label}</p><p className="text-2xl font-bold text-gray-900">{value}<span className="text-sm font-normal text-gray-400">{unit}</span></p></div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Score normalisé</p><p className={`text-2xl font-bold ${hc.text}`}>{Math.round(s.normalized_score || 0)}<span className="text-sm font-normal text-gray-400">/100</span></p></div>
        <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Répondants</p><p className="text-2xl font-bold text-gray-900">{s.n ?? qa.response_count ?? '—'}</p></div>
        {s.skewness != null && <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Asymétrie (g)</p><p className={`text-2xl font-bold ${Math.abs(s.skewness) > 1 ? 'text-orange-600' : 'text-gray-900'}`}>{fmt(s.skewness, 2)}</p></div>}
        {s.kurtosis != null && <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Kurtosis (κ)</p><p className={`text-2xl font-bold ${Math.abs(s.kurtosis) > 2 ? 'text-orange-600' : 'text-gray-900'}`}>{fmt(s.kurtosis, 2)}</p></div>}
      </div>
      {Object.keys(percentiles).length > 0 && (
        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Percentiles de distribution</p><div className="grid grid-cols-5 gap-2">{[['p10', 'P10'], ['p25', 'P25'], ['p50', 'P50 (médiane)'], ['p75', 'P75'], ['p90', 'P90']].map(([k, label]) => percentiles[k] != null && (<div key={k} className="text-center p-2.5 bg-gray-50 rounded-lg border border-gray-100"><p className="text-xs text-gray-400 mb-0.5">{label}</p><p className="text-sm font-bold text-gray-900">{fmt(percentiles[k])}</p></div>))}</div></div>
      )}
      <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: hc.bg, borderColor: `${hc.bar}33` }}>
        <Award className={`w-5 h-5 flex-shrink-0 ${hc.text}`} />
        <div className="flex-1"><p className={`text-sm font-bold ${hc.text}`}>Benchmark interne : {hc.label}</p><p className="text-xs text-gray-500 mt-0.5">Score normalisé {Math.round(s.normalized_score || 0)}/100 · Plage : {s.min} – {s.max} sur {s.max_scale}</p></div>
        <div className="w-24"><div className="h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(s.normalized_score || 0, 100)}%`, background: hc.bar }} /></div></div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Distribution des notes</p>
        <div className="space-y-2">
          {Object.entries(vd).sort((a, b) => Number(b[0]) - Number(a[0])).map(([val, cnt]) => { const pctVal = pct[val]?.pct ?? Math.round(cnt / Math.max(qa.response_count, 1) * 100); return (<div key={val} className="flex items-center gap-3"><span className="text-sm font-bold text-gray-700 w-8 text-right">{val}</span><div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden relative"><div className="h-full rounded-md" style={{ width: `${(cnt / maxCount) * 100}%`, background: hc.bar, transition: 'width .4s ease' }} /><span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-gray-700">{cnt} rép. ({pctVal}%)</span></div></div>); })}
        </div>
      </div>
      {s.segments && (<div className="grid grid-cols-3 gap-3">{[{ key: 'high', label: 'Élevé', color: '#22c55e' }, { key: 'mid', label: 'Moyen', color: '#eab308' }, { key: 'low', label: 'Faible', color: '#ef4444' }].map(({ key, label, color }) => { const seg = s.segments[key] || { count: 0, pct: 0 }; return (<div key={key} className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400 mb-1">{label}</p><p className="text-xl font-bold" style={{ color }}>{fmtP(seg.pct, 1)}</p><p className="text-xs text-gray-400">{seg.count} rép.</p></div>); })}</div>)}
    </div>
  );
}

function ChoiceQuestionDetail({ qa }) {
  const dist = qa.distribution || {}, sorted = Object.entries(dist).sort((a, b) => b[1].count - a[1].count);
  const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ef4444', '#06b6d4', '#84cc16', '#ec4899'];
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl"><Target className="w-4 h-4 text-blue-600" /><div><p className="text-xs text-gray-500">Option dominante</p><p className="text-sm font-bold text-blue-900">{qa.dominant_option} — {fmtP(qa.dominance_pct)}</p></div></div>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl"><Activity className="w-4 h-4 text-gray-500" /><div><p className="text-xs text-gray-500">Consensus</p><p className={`text-sm font-bold ${qa.consensus === 'Forte' ? 'text-green-700' : qa.consensus === 'Modérée' ? 'text-yellow-700' : 'text-gray-700'}`}>{qa.consensus}</p></div></div>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl"><Hash className="w-4 h-4 text-gray-500" /><div><p className="text-xs text-gray-500">Options distinctes</p><p className="text-sm font-bold text-gray-900">{qa.unique_options}</p></div></div>
        {qa.entropy != null && (<div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl"><Brain className="w-4 h-4 text-purple-600" /><div><p className="text-xs text-gray-500">Entropie Shannon</p><p className="text-sm font-bold text-purple-900">{fmt(qa.entropy, 3)} bits</p><p className="text-xs text-purple-500">{qa.entropy < 1 ? 'Très concentré' : qa.entropy < 2 ? 'Modérément dispersé' : 'Très diversifié'}</p></div></div>)}
      </div>
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Distribution des réponses</p>
        {sorted.map(([opt, d], i) => <MiniBar key={opt} value={d.pct} max={100} color={colors[i % colors.length]} label={opt} count={d.count} />)}
      </div>
    </div>
  );
}

function GlobalInsights({ data }) {
  const hc = HEALTH_COLOR(data.global_health_score), topics = data.top_topics || [], depts = data.department_health || {}, timeline = data.timeline || [], trend = data.trend || 'stable';
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Panel className="p-5 col-span-2 md:col-span-1"><div className="flex flex-col items-center text-center"><HealthRing score={data.global_health_score} size={80} /><p className="text-xs text-gray-500 mt-2">Score santé global</p><Badge color={data.global_health_score >= 65 ? 'green' : data.global_health_score >= 50 ? 'blue' : 'red'} small>{hc.label}</Badge></div></Panel>
        {[{ label: 'NPS Global', value: `${(data.global_nps || 0) > 0 ? '+' : ''}${data.global_nps ?? '—'}`, color: (data.global_nps || 0) > 0 ? 'text-green-600' : 'text-red-600', icon: Target }, { label: 'Rép. textuelles', value: data.total_text_responses ?? 0, icon: MessageSquare }, { label: 'Tendance', value: trend === 'improving' ? '↑ Hausse' : trend === 'declining' ? '↓ Baisse' : '→ Stable', color: trend === 'improving' ? 'text-green-600' : trend === 'declining' ? 'text-red-600' : 'text-gray-600', icon: TrendingUp }].map(({ label, value, color, icon: Icon }) => (
          <Panel key={label} className="p-5"><div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4 text-gray-400" /><p className="text-xs text-gray-400">{label}</p></div><p className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value}</p></Panel>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel>
          <PanelHeader title="Santé par département" subtitle="Moyenne cross-enquêtes" icon={Users} />
          <div className="p-5 space-y-3">
            {Object.keys(depts).length === 0 ? <EmptyState icon={Users} title="Données insuffisantes" />
              : Object.entries(depts).sort((a, b) => (b[1] || 0) - (a[1] || 0)).map(([dept, score]) => { const dhc = HEALTH_COLOR(score); return (<div key={dept}><div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-700">{dept}</span><span className={`text-sm font-bold ${dhc.text}`}>{Math.round(score || 0)}/100</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.min(score || 0, 100)}%`, background: dhc.bar }} /></div></div>); })}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Thèmes globaux récurrents" subtitle="NLP cross-enquêtes" icon={Lightbulb} />
          <div className="p-5">
            {topics.length === 0 ? <EmptyState icon={MessageSquare} title="Aucun thème" desc="Ajoutez des questions texte dans vos enquêtes." />
              : (<div className="space-y-2.5">{topics.map(([t, cnt], i) => { const maxCnt = topics[0]?.[1] || 1, colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ef4444', '#06b6d4', '#84cc16', '#ec4899']; return (<div key={t} className="flex items-center gap-3"><span className="text-xs text-gray-500 w-32 flex-shrink-0">{TOPIC_LABELS[t] || t}</span><div className="flex-1 h-5 bg-gray-100 rounded-md overflow-hidden relative"><div className="h-full rounded-md" style={{ width: `${(cnt / maxCnt) * 100}%`, background: colors[i % colors.length] }} /><span className="absolute inset-0 flex items-center px-2 text-xs font-medium" style={{ color: (cnt / maxCnt) > 0.4 ? '#fff' : '#374151' }}>{cnt} mention(s)</span></div></div>); })}
              </div>)}
          </div>
        </Panel>
      </div>
      {timeline.length > 0 && (
        <Panel>
          <PanelHeader title="Évolution temporelle" subtitle="Score de santé ML par enquête" icon={TrendingUp} />
          <div className="p-5">
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200" />
              <div className="flex items-end gap-3 h-32 relative">
                {timeline.map((t, i) => { const thc = HEALTH_COLOR(t.score); return (<div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0"><div className="relative flex flex-col items-center" style={{ height: 80, justifyContent: 'flex-end' }}><div className="rounded-t-md w-8 min-h-1" style={{ height: `${Math.round(t.score || 0)}%`, background: thc.bar, maxHeight: '100%', transition: 'height .5s ease' }} /><div className="absolute -top-5 w-16 text-center"><span className={`text-xs font-bold ${thc.text}`}>{Math.round(t.score || 0)}</span></div></div><p className="text-xs text-gray-400 truncate w-full text-center">{t.date}</p><p className="text-xs text-gray-500 truncate w-full text-center" title={t.title}>{t.title}</p></div>); })}
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}