import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axios from 'axios';
import {
    Briefcase, Plus, X, Save, Trash2, Edit2, Users,
    CheckCircle, AlertCircle, ChevronDown, ChevronUp,
    UserPlus, XCircle, Clock, Award
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CONTRATS = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];

const POSTE_STATUS = {
    open: { label: 'Ouvert', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    paused: { label: 'Pausé', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    closed: { label: 'Clôturé', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600' },
};

const CANDIDAT_STATUS = {
    nouveau: { label: 'Nouveau', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Clock },
    entretien: { label: 'Entretien', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Users },
    retenu: { label: 'Retenu', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: Award },
    rejete: { label: 'Rejeté', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle },
};

export default function Recrutement() {
    const { user, token } = useAuth();
    const [postes, setPostes] = useState([]);
    const [candidats, setCandidats] = useState({});
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [showPosteModal, setShowPosteModal] = useState(false);
    const [showCandidatModal, setShowCandidatModal] = useState(false);
    const [editPoste, setEditPoste] = useState(null);
    const [editCandidat, setEditCandidat] = useState(null);
    const [activePoste, setActivePoste] = useState(null);
    const [toast, setToast] = useState(null);

    const [posteForm, setPosteForm] = useState({
        title: '', description: '', requirements: '', type_contrat: 'CDI', nb_postes: 1,
    });
    const [candidatForm, setCandidatForm] = useState({
        full_name: '', email: '', phone: '', note: '',
    });

    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
        try {
            const res = await axios.get(`${API_URL}/recrutement`, { headers });
            setPostes(res.data);
            const cMap = {};
            await Promise.all(res.data.map(async p => {
                const cr = await axios.get(`${API_URL}/recrutement/${p.id}/candidats`, { headers });
                cMap[p.id] = cr.data;
            }));
            setCandidats(cMap);
        } catch { showToast('Erreur de chargement', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openPoste = (p = null) => {
        setEditPoste(p);
        setPosteForm(p
            ? { title: p.title, description: p.description, requirements: p.requirements, type_contrat: p.type_contrat, nb_postes: p.nb_postes }
            : { title: '', description: '', requirements: '', type_contrat: 'CDI', nb_postes: 1 }
        );
        setShowPosteModal(true);
    };

    const openCandidat = (posteId, c = null) => {
        setActivePoste(posteId);
        setEditCandidat(c);
        setCandidatForm(c
            ? { full_name: c.full_name, email: c.email, phone: c.phone, note: c.note }
            : { full_name: '', email: '', phone: '', note: '' }
        );
        setShowCandidatModal(true);
    };

    const handlePosteSubmit = async () => {
        if (!posteForm.title) { showToast('Le titre est obligatoire', 'error'); return; }
        try {
            if (editPoste) {
                await axios.put(`${API_URL}/recrutement/${editPoste.id}`, posteForm, { headers });
                showToast('Poste mis à jour');
            } else {
                await axios.post(`${API_URL}/recrutement`, posteForm, { headers });
                showToast('Poste créé');
            }
            setShowPosteModal(false); load();
        } catch (e) { showToast(e.response?.data?.error || 'Erreur', 'error'); }
    };

    const handleCandidatSubmit = async () => {
        if (!candidatForm.full_name) { showToast('Le nom est obligatoire', 'error'); return; }
        try {
            if (editCandidat) {
                await axios.put(`${API_URL}/recrutement/candidats/${editCandidat.id}`, candidatForm, { headers });
                showToast('Candidat mis à jour');
            } else {
                await axios.post(`${API_URL}/recrutement/${activePoste}/candidats`, candidatForm, { headers });
                showToast('Candidat ajouté');
            }
            setShowCandidatModal(false); load();
        } catch (e) { showToast(e.response?.data?.error || 'Erreur', 'error'); }
    };

    const handlePosteStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/recrutement/${id}`, { status }, { headers });
            showToast('Statut mis à jour'); load();
        } catch { showToast('Erreur', 'error'); }
    };

    const handleCandidatStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/recrutement/candidats/${id}`, { status }, { headers });
            showToast('Statut candidat mis à jour'); load();
        } catch { showToast('Erreur', 'error'); }
    };

    const handleDeletePoste = async (id) => {
        if (!window.confirm('Supprimer ce poste et tous ses candidats ?')) return;
        try { await axios.delete(`${API_URL}/recrutement/${id}`, { headers }); showToast('Poste supprimé'); load(); }
        catch { showToast('Erreur', 'error'); }
    };

    const handleDeleteCandidat = async (id) => {
        if (!window.confirm('Supprimer ce candidat ?')) return;
        try { await axios.delete(`${API_URL}/recrutement/candidats/${id}`, { headers }); showToast('Candidat supprimé'); load(); }
        catch { showToast('Erreur', 'error'); }
    };

    const totalCandidats = Object.values(candidats).reduce((s, arr) => s + arr.length, 0);
    const postesOuverts = postes.filter(p => p.status === 'open').length;

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
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Recrutement</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les postes ouverts et candidats · {user?.department}</p>
                        </div>
                        <button onClick={() => openPoste()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Ouvrir un poste
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Postes ouverts', value: postesOuverts, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                            { label: 'Total candidats', value: totalCandidats, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                            { label: 'Retenus', value: Object.values(candidats).flat().filter(c => c.status === 'retenu').length, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
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

                    {/* Postes */}
                    <div className="space-y-4">
                        {postes.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-16 text-center">
                                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucun poste ouvert</p>
                                <p className="text-slate-400 text-sm mt-1">Cliquez sur "Ouvrir un poste" pour commencer</p>
                            </div>
                        ) : postes.map(p => {
                            const sc = POSTE_STATUS[p.status] || POSTE_STATUS.open;
                            const pCands = candidats[p.id] || [];
                            const isOpen = expanded[p.id];
                            return (
                                <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                    {/* En-tête poste */}
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{p.title}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                                                        {sc.label}
                                                    </span>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full">
                                                        {p.type_contrat}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    {p.nb_postes} poste{p.nb_postes > 1 ? 's' : ''} · {pCands.length} candidat{pCands.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {p.status === 'open' && (
                                                <button onClick={() => handlePosteStatus(p.id, 'paused')}
                                                    className="px-3 py-1.5 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                                                    Mettre en pause
                                                </button>
                                            )}
                                            {p.status === 'paused' && (
                                                <button onClick={() => handlePosteStatus(p.id, 'open')}
                                                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                                                    Réouvrir
                                                </button>
                                            )}
                                            {p.status !== 'closed' && (
                                                <button onClick={() => handlePosteStatus(p.id, 'closed')}
                                                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                                                    Clôturer
                                                </button>
                                            )}
                                            <button onClick={() => openPoste(p)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4 text-slate-400" />
                                            </button>
                                            <button onClick={() => handleDeletePoste(p.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                            <button onClick={() => setExpanded(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Candidats */}
                                    {isOpen && (
                                        <div className="border-t border-slate-100 dark:border-slate-700">
                                            {/* Description */}
                                            {(p.description || p.requirements) && (
                                                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                                                    {p.description && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">{p.description}</p>
                                                        </div>
                                                    )}
                                                    {p.requirements && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prérequis</p>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">{p.requirements}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Header candidats */}
                                            <div className="flex items-center justify-between px-5 py-3">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    Candidats ({pCands.length})
                                                </p>
                                                <button onClick={() => openCandidat(p.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors">
                                                    <UserPlus className="w-3.5 h-3.5" /> Ajouter
                                                </button>
                                            </div>

                                            {pCands.length === 0 ? (
                                                <div className="px-5 py-6 text-center text-slate-400 text-sm">
                                                    Aucun candidat pour ce poste
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                                    {pCands.map(c => {
                                                        const cs = CANDIDAT_STATUS[c.status] || CANDIDAT_STATUS.nouveau;
                                                        const CsIcon = cs.icon;
                                                        return (
                                                            <div key={c.id} className="flex items-center justify-between px-5 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                                                                        {c.full_name?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.full_name}</p>
                                                                        <p className="text-xs text-slate-400">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${cs.bg} ${cs.text} ${cs.border}`}>
                                                                        <CsIcon className="w-3 h-3" />{cs.label}
                                                                    </span>
                                                                    <select
                                                                        value={c.status}
                                                                        onChange={e => handleCandidatStatus(c.id, e.target.value)}
                                                                        className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    >
                                                                        <option value="nouveau">Nouveau</option>
                                                                        <option value="entretien">Entretien</option>
                                                                        <option value="retenu">Retenu</option>
                                                                        <option value="rejete">Rejeté</option>
                                                                    </select>
                                                                    <button onClick={() => openCandidat(p.id, c)}
                                                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                                                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteCandidat(c.id)}
                                                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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

            {/* Modal Poste */}
            {showPosteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">
                                {editPoste ? 'Modifier le poste' : 'Ouvrir un poste'}
                            </h2>
                            <button onClick={() => setShowPosteModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Intitulé du poste *</label>
                                <input value={posteForm.title} onChange={e => setPosteForm({ ...posteForm, title: e.target.value })}
                                    placeholder="Ex: Développeur Full-Stack"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Type de contrat</label>
                                    <select value={posteForm.type_contrat} onChange={e => setPosteForm({ ...posteForm, type_contrat: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {CONTRATS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nb de postes</label>
                                    <input type="number" min={1} value={posteForm.nb_postes}
                                        onChange={e => setPosteForm({ ...posteForm, nb_postes: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea value={posteForm.description} onChange={e => setPosteForm({ ...posteForm, description: e.target.value })}
                                    rows={2} placeholder="Décrivez les missions du poste..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Prérequis</label>
                                <textarea value={posteForm.requirements} onChange={e => setPosteForm({ ...posteForm, requirements: e.target.value })}
                                    rows={2} placeholder="Compétences, expériences requises..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setShowPosteModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                Annuler
                            </button>
                            <button onClick={handlePosteSubmit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
                                <Save className="w-4 h-4" />{editPoste ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Candidat */}
            {showCandidatModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="font-bold text-slate-900 dark:text-white">
                                {editCandidat ? 'Modifier le candidat' : 'Ajouter un candidat'}
                            </h2>
                            <button onClick={() => setShowCandidatModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {[
                                { label: 'Nom complet *', key: 'full_name', placeholder: 'Prénom Nom', type: 'text' },
                                { label: 'Email', key: 'email', placeholder: 'email@exemple.com', type: 'email' },
                                { label: 'Téléphone', key: 'phone', placeholder: '+213 XXX XXX XXX', type: 'tel' },
                            ].map(({ label, key, placeholder, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                                    <input type={type} value={candidatForm[key]}
                                        onChange={e => setCandidatForm({ ...candidatForm, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
                                <textarea value={candidatForm.note} onChange={e => setCandidatForm({ ...candidatForm, note: e.target.value })}
                                    rows={3} placeholder="Observations sur le candidat..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <button onClick={() => setShowCandidatModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                Annuler
                            </button>
                            <button onClick={handleCandidatSubmit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
                                <Save className="w-4 h-4" />{editCandidat ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}