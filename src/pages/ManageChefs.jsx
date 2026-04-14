import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import {
    Crown, Users, ChevronDown, ChevronUp,
    Shield, CheckCircle, XCircle, Search,
    Building2, UserCheck, UserX, Loader2, Award
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const DEPARTMENTS = [
    'Informatique', 'Ressources Humaines', 'Finance',
    'Marketing', 'Commercial', 'Production', 'Logistique'
];

const DEPT_COLORS = {
    'Informatique': { accent: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    'Ressources Humaines': { accent: '#ec4899', light: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
    'Finance': { accent: '#10b981', light: '#f0fdf4', border: '#bbf7d0', text: '#047857' },
    'Marketing': { accent: '#f97316', light: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
    'Commercial': { accent: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    'Production': { accent: '#eab308', light: '#fefce8', border: '#fef08a', text: '#a16207' },
    'Logistique': { accent: '#06b6d4', light: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
};

export default function ManageChefs() {
    const { token } = useAuth();
    const [byDept, setByDept] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/users/by-department`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setByDept(data);
            const all = {};
            DEPARTMENTS.forEach(d => { all[d] = true; });
            setExpanded(all);
        } catch {
            showToast('Erreur lors du chargement', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleAction = async (userId, action, userName, dept) => {
        setActionLoading(userId);
        try {
            await axios.put(
                `${API_URL}/users/${userId}/set-chef`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast(
                action === 'promote'
                    ? `${userName} est maintenant chef de ${dept}`
                    : `${userName} a été révoqué`,
                'success'
            );
            await fetchData();
        } catch (err) {
            showToast(err.response?.data?.error || 'Une erreur est survenue', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const toggleDept = (dept) =>
        setExpanded(prev => ({ ...prev, [dept]: !prev[dept] }));

    const filterUsers = (users) => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(u =>
            u.full_name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.position?.toLowerCase().includes(q)
        );
    };

    const totalEmployees = Object.values(byDept).reduce((s, arr) => s + arr.length, 0);
    const totalChefs = Object.values(byDept).reduce(
        (s, arr) => s + arr.filter(u => u.role === 'chef_departement').length, 0
    );
    const deptsWithoutChef = DEPARTMENTS.filter(d =>
        !(byDept[d] || []).some(u => u.role === 'chef_departement')
    ).length;

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Topbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">Chargement des départements...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold transition-all ${toast.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {toast.type === 'success'
                            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                            : <XCircle className="w-4 h-4 text-red-500" />}
                        {toast.message}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Chefs de Département
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Nommez ou révoquez les responsables de chaque département
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total employés', value: totalEmployees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'Chefs nommés', value: totalChefs, icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                            { label: 'Depts sans chef', value: deptsWithoutChef, icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
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

                    {/* Recherche */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un employé..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Départements */}
                    <div className="space-y-3">
                        {DEPARTMENTS.map(dept => {
                            const users = filterUsers(byDept[dept] || []);
                            const chef = (byDept[dept] || []).find(u => u.role === 'chef_departement');
                            const color = DEPT_COLORS[dept];
                            const isOpen = expanded[dept];

                            return (
                                <div key={dept} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">

                                    {/* En-tête département */}
                                    <button
                                        onClick={() => toggleDept(dept)}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Couleur accent */}
                                            <div
                                                className="w-1 h-10 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: color.accent }}
                                            />
                                            <div
                                                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: color.light, border: `1px solid ${color.border}` }}
                                            >
                                                <Building2 className="w-4 h-4" style={{ color: color.accent }} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{dept}</p>
                                                <p className="text-xs text-slate-400">
                                                    {(byDept[dept] || []).length} employé{(byDept[dept] || []).length > 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            {/* Badge chef actuel */}
                                            {chef ? (
                                                <span
                                                    className="ml-2 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                    style={{ backgroundColor: color.light, color: color.text, border: `1px solid ${color.border}` }}
                                                >
                                                    <Crown className="w-3 h-3" />
                                                    {chef.full_name}
                                                </span>
                                            ) : (
                                                <span className="ml-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                                    <XCircle className="w-3 h-3" />
                                                    Aucun chef
                                                </span>
                                            )}
                                        </div>

                                        {isOpen
                                            ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                                    </button>

                                    {/* Liste employés */}
                                    {isOpen && (
                                        <div className="border-t border-slate-100 dark:border-slate-700">
                                            {users.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                    <p className="text-sm text-slate-400">Aucun employé trouvé</p>
                                                </div>
                                            ) : (
                                                users.map((u, i) => {
                                                    const isChef = u.role === 'chef_departement';
                                                    const isLoading = actionLoading === u.id;

                                                    return (
                                                        <div
                                                            key={u.id}
                                                            className={`flex items-center justify-between px-5 py-3.5 transition-colors ${i !== users.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''
                                                                } ${isChef ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                                                            style={isChef ? { backgroundColor: color.light } : {}}
                                                        >
                                                            {/* Avatar + infos */}
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                                                                    style={{ backgroundColor: isChef ? color.accent : '#94a3b8' }}
                                                                >
                                                                    {u.full_name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{u.full_name}</p>
                                                                        {isChef && (
                                                                            <span
                                                                                className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                                                                style={{ backgroundColor: color.accent }}
                                                                            >
                                                                                <Crown className="w-2.5 h-2.5" />
                                                                                CHEF
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-slate-400">{u.position || 'Poste non défini'} · {u.email}</p>
                                                                </div>
                                                            </div>

                                                            {/* Bouton action */}
                                                            {isChef ? (
                                                                <button
                                                                    onClick={() => handleAction(u.id, 'revoke', u.full_name, dept)}
                                                                    disabled={isLoading}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    {isLoading
                                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                        : <UserX className="w-3.5 h-3.5" />}
                                                                    Révoquer
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAction(u.id, 'promote', u.full_name, dept)}
                                                                    disabled={isLoading}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    {isLoading
                                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                        : <UserCheck className="w-3.5 h-3.5" />}
                                                                    Nommer chef
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}