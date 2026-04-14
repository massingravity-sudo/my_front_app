import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import {
    Star, Plus, X, Save, Trash2, ChevronDown,
    ChevronUp, User, Award, AlertCircle, CheckCircle,
    BarChart2, Edit2
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CRITERIA = [
    { key: 'ponctualite', label: 'Ponctualité' },
    { key: 'qualite', label: 'Qualité du travail' },
    { key: 'initiative', label: 'Initiative' },
    { key: 'travail_equipe', label: 'Travail en équipe' },
    { key: 'communication', label: 'Communication' },
];

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];

const scoreColor = (s) => {
    if (s >= 4) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (s >= 3) return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (s >= 2) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
};

const scoreLabel = (s) => {
    if (s >= 4.5) return 'Excellent';
    if (s >= 3.5) return 'Bien';
    if (s >= 2.5) return 'Satisfaisant';
    if (s >= 1.5) return 'Insuffisant';
    return 'Faible';
};

export default function Evaluation() {
    const { user, token } = useAuth();
    const [evaluations, setEvaluations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [expanded, setExpanded] = useState({});

    const [form, setForm] = useState({
        employee_id: '', period: 'Q2 2026', comment: '',
        scores: { ponctualite: 3, qualite: 3, initiative: 3, travail_equipe: 3, communication: 3 },
    });

    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
        try {
            const [evRes, empRes] = await Promise.all([
                axios.get(`${API_URL}/evaluations`, { headers }),
                axios.get(`${API_URL}/users/by-department`, { headers }),
            ]);
            setEvaluations(evRes.data);
            const dept = user?.department;
            setEmployees(empRes.data[dept] || []);
        } catch { showToast('Erreur de chargement', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const globalScore = (scores) => {
        const vals = Object.values(scores);
        return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    };

    const openCreate = () => {
        setEditTarget(null);
        setForm({
            employee_id: '', period: 'Q2 2026', comment: '',
            scores: { ponctualite: 3, qualite: 3, initiative: 3, travail_equipe: 3, communication: 3 }
        });
        setShowModal(true);
    };

    const openEdit = (ev) => {
        setEditTarget(ev);
        setForm({ employee_id: ev.employee_id, period: ev.period, comment: ev.comment, scores: { ...ev.scores } });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.employee_id || !form.period) { showToast('Remplissez tous les champs', 'error'); return; }
        const gs = parseFloat(globalScore(form.scores));
        try {
            if (editTarget) {
                await axios.put(`${API_URL}/evaluations/${editTarget.id}`, { ...form, global_score: gs }, { headers });
                showToast('Évaluation mise à jour');
            } else {
                await axios.post(`${API_URL}/evaluations`, { ...form, global_score: gs }, { headers });
                showToast('Évaluation créée');
            }
            setShowModal(false);
            load();
        } catch (e) { showToast(e.response?.data?.error || 'Erreur', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette évaluation ?')) return;
        try {
            await axios.delete(`${API_URL}/evaluations/${id}`, { headers });
            showToast('Évaluation supprimée');
            load();
        } catch { showToast('Erreur', 'error'); }
    };

    const avgGlobal = evaluations.length
        ? (evaluations.reduce((s, e) => s + (e.global_score || 0), 0) / evaluations.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar /><div className="flex-1 flex flex-col"><Topbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold border ${toast.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {toast.type === 'success'
                            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                            : <AlertCircle className="w-4 h-4 text-red-500" />}
                        {toast.msg}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Évaluation des Employés</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Évaluez les membres de votre département · {user?.department}</p>
                        </div>
                        <button onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Nouvelle évaluation
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Évaluations totales', value: evaluations.length, icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'Score moyen', value: `${avgGlobal}/5`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                            { label: 'Employés évalués', value: new Set(evaluations.map(e => e.employee_id)).size, icon: User, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                        ].map(({ label, value, icon: Icon, color, bg, border }) => (
                            <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex items-center gap-4`}>
                                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border ${border}`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Liste évaluations */}
                    <div className="space-y-3">
                        {evaluations.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-16 text-center">
                                <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucune évaluation créée</p>
                                <p className="text-slate-400 text-sm mt-1">Cliquez sur "Nouvelle évaluation" pour commencer</p>
                            </div>
                        ) : evaluations.map(ev => {
                            const c = scoreColor(ev.global_score);
                            const isOpen = expanded[ev.id];
                            return (
                                <div key={ev.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {ev.employee?.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{ev.employee?.full_name}</p>
                                                <p className="text-xs text-slate-400">{ev.employee?.position} · {ev.period}</p>
                                            </div>
                                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}>
                                                <Star className="w-3 h-3" />
                                                {ev.global_score}/5 — {scoreLabel(ev.global_score)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(ev)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4 text-slate-400" />
                                            </button>
                                            <button onClick={() => handleDelete(ev.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                            <button onClick={() => setExpanded(p => ({ ...p, [ev.id]: !p[ev.id] }))}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4">
                                            <div className="grid grid-cols-5 gap-3 mb-4">
                                                {CRITERIA.map(cr => {
                                                    const s = ev.scores?.[cr.key] || 0;
                                                    const cc = scoreColor(s);
                                                    return (
                                                        <div key={cr.key} className={`${cc.bg} border ${cc.border} rounded-lg p-3 text-center`}>
                                                            <p className="text-xs text-slate-500 mb-1">{cr.label}</p>
                                                            <p className={`text-xl font-bold ${cc.text}`}>{s}/5</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {ev.comment && (
                                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300">
                                                    <span className="font-semibold">Commentaire : </span>{ev.comment}
                                                </div>
                                            )}
                                            <p className="text-xs text-slate-400 mt-2">
                                                Évalué par {ev.evaluator?.full_name} · {new Date(ev.created_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">
                                {editTarget ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-5">
                            {/* Employé */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Employé *</label>
                                <select value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Sélectionner un employé</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name} — {emp.position}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Période */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Période *</label>
                                <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            {/* Critères */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Critères d'évaluation</label>
                                <div className="space-y-3">
                                    {CRITERIA.map(cr => (
                                        <div key={cr.key} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 w-40">{cr.label}</span>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} onClick={() => setForm(f => ({ ...f, scores: { ...f.scores, [cr.key]: n } }))}
                                                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${form.scores[cr.key] >= n
                                                                ? 'bg-amber-400 text-white shadow-sm'
                                                                : 'bg-slate-100 dark:bg-slate-600 text-slate-400 hover:bg-amber-100'
                                                            }`}>{n}</button>
                                                ))}
                                                <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300 w-6">
                                                    {form.scores[cr.key]}/5
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-2 flex items-center justify-between">
                                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Score global</span>
                                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{globalScore(form.scores)}/5</span>
                                </div>
                            </div>
                            {/* Commentaire */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Commentaire</label>
                                <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
                                    rows={3} placeholder="Observations, points forts, axes d'amélioration..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                Annuler
                            </button>
                            <button onClick={handleSubmit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                                <Save className="w-4 h-4" />{editTarget ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}