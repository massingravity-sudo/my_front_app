import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import {
    Users, CheckCircle, Clock, AlertTriangle,
    TrendingUp, BarChart2, Star, Calendar,
    ChevronDown, ChevronUp, Activity
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function SuiviEquipe() {
    const { user, token } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const load = async () => {
            try {
                const [empRes, taskRes, evalRes, leaveRes] = await Promise.all([
                    axios.get(`${API_URL}/users/by-department`, { headers }),
                    axios.get(`${API_URL}/tasks`, { headers }),
                    axios.get(`${API_URL}/evaluations`, { headers }),
                    axios.get(`${API_URL}/leaves`, { headers }),
                ]);
                setEmployees(empRes.data[user?.department] || []);
                setTasks(taskRes.data);
                setEvaluations(evalRes.data);
                setLeaves(leaveRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const getEmployeeStats = (emp) => {
        const empTasks = tasks.filter(t => t.assigned_to_id === emp.id);
        const done = empTasks.filter(t => t.status === 'done').length;
        const inProg = empTasks.filter(t => t.status === 'in_progress').length;
        const overdue = empTasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done').length;
        const evals = evaluations.filter(e => e.employee_id === emp.id);
        const avgScore = evals.length ? (evals.reduce((s, e) => s + (e.global_score || 0), 0) / evals.length).toFixed(1) : null;
        const onLeave = leaves.some(l => l.employee_id === emp.id && l.status === 'approved' &&
            new Date(l.start_date) <= new Date() && new Date(l.end_date) >= new Date());
        const completion = empTasks.length ? Math.round((done / empTasks.length) * 100) : 0;
        return { total: empTasks.length, done, inProg, overdue, avgScore, onLeave, completion, evals };
    };

    const teamStats = {
        total: employees.length,
        onLeave: employees.filter(e => getEmployeeStats(e).onLeave).length,
        avgScore: (() => {
            const scores = evaluations.map(e => e.global_score).filter(Boolean);
            return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
        })(),
        tasksOk: tasks.filter(t => t.status === 'done').length,
    };

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
                <div className="flex-1 overflow-y-auto p-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Suivi de l'Équipe</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vue d'ensemble des performances · {user?.department}</p>
                    </div>

                    {/* Stats globales */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Membres', value: teamStats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'En congé', value: teamStats.onLeave, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                            { label: 'Score moyen', value: `${teamStats.avgScore}/5`, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                            { label: 'Tâches terminées', value: teamStats.tasksOk, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
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

                    {/* Cards employés */}
                    <div className="space-y-3">
                        {employees.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-16 text-center">
                                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucun employé dans votre département</p>
                            </div>
                        ) : employees.map(emp => {
                            const s = getEmployeeStats(emp);
                            const isOpen = expanded[emp.id];

                            return (
                                <div key={emp.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                    <button onClick={() => setExpanded(p => ({ ...p, [emp.id]: !p[emp.id] }))}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {emp.full_name?.charAt(0).toUpperCase()}
                                                </div>
                                                {s.onLeave && (
                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" title="En congé" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{emp.full_name}</p>
                                                    {s.onLeave && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">CONGÉ</span>}
                                                    {s.overdue > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full">{s.overdue} EN RETARD</span>}
                                                </div>
                                                <p className="text-xs text-slate-400">{emp.position}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            {/* Barre progression */}
                                            <div className="hidden md:block w-32">
                                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                    <span>Tâches</span><span>{s.completion}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                                                    <div className="h-full rounded-full bg-blue-500 transition-all"
                                                        style={{ width: `${s.completion}%` }} />
                                                </div>
                                            </div>
                                            {/* Score */}
                                            {s.avgScore && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-400" />
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.avgScore}</span>
                                                </div>
                                            )}
                                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4">
                                            <div className="grid grid-cols-4 gap-3 mb-4">
                                                {[
                                                    { label: 'Total tâches', value: s.total, color: 'text-slate-700', bg: 'bg-slate-50' },
                                                    { label: 'Terminées', value: s.done, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                    { label: 'En cours', value: s.inProg, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                    { label: 'En retard', value: s.overdue, color: 'text-red-600', bg: 'bg-red-50' },
                                                ].map(({ label, value, color, bg }) => (
                                                    <div key={label} className={`${bg} rounded-lg p-3 text-center`}>
                                                        <p className="text-xs text-slate-400 mb-1">{label}</p>
                                                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Évaluations */}
                                            {s.evals.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dernières évaluations</p>
                                                    <div className="space-y-1.5">
                                                        {s.evals.slice(0, 3).map(ev => (
                                                            <div key={ev.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                                                                <span className="text-xs text-slate-500">{ev.period}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 text-amber-400" />
                                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ev.global_score}/5</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
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