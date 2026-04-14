import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import {
    DollarSign, Plus, X, Save, Trash2, Edit2,
    CheckCircle, AlertCircle, Clock, TrendingUp, Award
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const TYPES_PRIME = [
    { value: 'performance', label: 'Performance' },
    { value: 'assiduite', label: 'Assiduité' },
    { value: 'objectif', label: 'Atteinte d\'objectif' },
    { value: 'anciennete', label: 'Ancienneté' },
    { value: 'exceptionnel', label: 'Exceptionnel' },
];

const PERIODS = ['Janvier 2026', 'Février 2026', 'Mars 2026', 'Avril 2026', 'Mai 2026', 'Juin 2026',
    'Juillet 2026', 'Août 2026', 'Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026',
    'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

const STATUS_CONFIG = {
    pending: { label: 'En attente', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Clock },
    approved: { label: 'Approuvée', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: CheckCircle },
    paid: { label: 'Versée', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: Award },
};

export default function Primes() {
    const { user, token } = useAuth();
    const [primes, setPrimes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const [form, setForm] = useState({
        employee_id: '', type: 'performance', amount: '',
        period: 'Q2 2026', reason: '',
    });

    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
        try {
            const [prRes, empRes] = await Promise.all([
                axios.get(`${API_URL}/primes`, { headers }),
                axios.get(`${API_URL}/users/by-department`, { headers }),
            ]);
            setPrimes(prRes.data);
            setEmployees(empRes.data[user?.department] || []);
        } catch { showToast('Erreur de chargement', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openCreate = () => {
        setEditTarget(null);
        setForm({ employee_id: '', type: 'performance', amount: '', period: 'Q2 2026', reason: '' });
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditTarget(p);
        setForm({ employee_id: p.employee_id, type: p.type, amount: p.amount, period: p.period, reason: p.reason });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.employee_id || !form.amount || !form.period) {
            showToast('Remplissez tous les champs obligatoires', 'error'); return;
        }
        try {
            if (editTarget) {
                await axios.put(`${API_URL}/primes/${editTarget.id}`, form, { headers });
                showToast('Prime mise à jour');
            } else {
                await axios.post(`${API_URL}/primes`, form, { headers });
                showToast('Prime attribuée');
            }
            setShowModal(false); load();
        } catch (e) { showToast(e.response?.data?.error || 'Erreur', 'error'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette prime ?')) return;
        try {
            await axios.delete(`${API_URL}/primes/${id}`, { headers });
            showToast('Prime supprimée'); load();
        } catch { showToast('Erreur', 'error'); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`${API_URL}/primes/${id}`, { status }, { headers });
            showToast('Statut mis à jour'); load();
        } catch { showToast('Erreur', 'error'); }
    };

    const filtered = filterStatus === 'all' ? primes : primes.filter(p => p.status === filterStatus);
    const totalAmount = primes.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const pending = primes.filter(p => p.status === 'pending').length;

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
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                        {toast.msg}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Primes de Rendement</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Attribuez et gérez les primes de votre équipe · {user?.department}</p>
                        </div>
                        <button onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Attribuer une prime
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total versé', value: `${totalAmount.toLocaleString('fr-FR')} DA`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                            { label: 'En attente', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                            { label: 'Total primes', value: primes.length, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        ].map(({ label, value, icon: Icon, color, bg, border }) => (
                            <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex items-center gap-4`}>
                                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border ${border}`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filtres */}
                    <div className="flex gap-2 mb-5">
                        {[
                            { val: 'all', label: 'Toutes' },
                            { val: 'pending', label: 'En attente' },
                            { val: 'approved', label: 'Approuvées' },
                            { val: 'paid', label: 'Versées' },
                        ].map(f => (
                            <button key={f.val} onClick={() => setFilterStatus(f.val)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filterStatus === f.val
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                                    }`}>{f.label}
                            </button>
                        ))}
                    </div>

                    {/* Liste */}
                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-16 text-center">
                                <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucune prime trouvée</p>
                            </div>
                        ) : filtered.map(p => {
                            const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                            const StatusIcon = sc.icon;
                            const typeLabel = TYPES_PRIME.find(t => t.value === p.type)?.label || p.type;
                            return (
                                <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {p.employee?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{p.employee?.full_name}</p>
                                                <span className="text-xs text-slate-400">· {typeLabel} · {p.period}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">{p.reason || 'Aucun motif renseigné'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-emerald-600">{Number(p.amount).toLocaleString('fr-FR')} DA</span>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                                            <StatusIcon className="w-3 h-3" />{sc.label}
                                        </span>

                                        {/* Actions statut */}
                                        {p.status === 'pending' && (
                                            <button onClick={() => handleStatusChange(p.id, 'approved')}
                                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors">
                                                Approuver
                                            </button>
                                        )}
                                        {p.status === 'approved' && (
                                            <button onClick={() => handleStatusChange(p.id, 'paid')}
                                                className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
                                                Marquer versée
                                            </button>
                                        )}
                                        <button onClick={() => openEdit(p)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4 text-slate-400" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">
                                {editTarget ? 'Modifier la prime' : 'Attribuer une prime'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {[
                                { label: 'Employé *', type: 'select', key: 'employee_id', options: employees.map(e => ({ value: e.id, label: `${e.full_name} — ${e.position}` })) },
                                { label: 'Type de prime *', type: 'select', key: 'type', options: TYPES_PRIME.map(t => ({ value: t.value, label: t.label })) },
                                { label: 'Période *', type: 'select', key: 'period', options: PERIODS.map(p => ({ value: p, label: p })) },
                            ].map(({ label, type, key, options }) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                                    <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Sélectionner...</option>
                                        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Montant (DA) *</label>
                                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                    placeholder="Ex: 15000"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Motif</label>
                                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                                    rows={3} placeholder="Justification de la prime..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                Annuler
                            </button>
                            <button onClick={handleSubmit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
                                <Save className="w-4 h-4" />{editTarget ? 'Mettre à jour' : 'Attribuer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}