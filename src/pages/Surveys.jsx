import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { surveysAPI } from '../services/api';
import { ClipboardList, CheckCircle, Clock, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Surveys() {
    const { user } = useAuth();
    const { darkMode } = useApp();
    const navigate = useNavigate();

    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // ── Palette ────────────────────────────────────────────
    const d = darkMode ? {
        page: 'bg-slate-900',
        card: 'bg-slate-800 border-slate-700',
        text: 'text-slate-100',
        textMuted: 'text-slate-400',
        input: 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-blue-500',
        label: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700',
        optHover: 'hover:bg-slate-700',
        modal: 'bg-slate-800',
        scaleBtn: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
        divider: 'border-slate-700',
        cancelBtn: 'border-slate-600 text-slate-300 hover:bg-slate-700',
        statBg: ['bg-blue-900/30 border-blue-800', 'bg-green-900/30 border-green-800', 'bg-purple-900/30 border-purple-800'],
    } : {
        page: 'bg-gray-50',
        card: 'bg-white border-gray-200',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500',
        label: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
        optHover: 'hover:bg-gray-50',
        modal: 'bg-white',
        scaleBtn: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        divider: 'border-gray-200',
        cancelBtn: 'border-gray-300 text-gray-700 hover:bg-gray-50',
        statBg: ['bg-white border-gray-200', 'bg-white border-gray-200', 'bg-white border-gray-200'],
    };

    useEffect(() => { loadSurveys(); }, []);

    const loadSurveys = async () => {
        try { const r = await surveysAPI.getAll(); setSurveys(r.data); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleOpenSurvey = async (survey) => {
        if (survey.has_responded) return;
        try {
            const r = await surveysAPI.getDetail(survey.id);
            setSelectedSurvey(r.data);
            setAnswers(new Array(r.data.questions.length).fill(''));
        } catch (e) { console.error(e); }
    };

    const handleAnswerChange = (qi, value) => {
        const a = [...answers]; a[qi] = value; setAnswers(a);
    };

    const handleSubmitSurvey = async () => {
        setSubmitting(true);
        try {
            await surveysAPI.respond(selectedSurvey.id, { answers });
            alert('Réponse enregistrée avec succès !');
            setSelectedSurvey(null); setAnswers([]); loadSurveys();
        } catch (e) {
            alert(e.response?.data?.error || "Erreur lors de l'envoi");
        } finally { setSubmitting(false); }
    };

    const getStatusColor = (survey) => {
        if (survey.has_responded) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        const days = Math.ceil((new Date(survey.deadline) - new Date()) / 86400000);
        if (days < 0) return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
        if (days <= 3) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    };

    if (loading) return (
        <div className={`flex h-screen ${d.page}`}>
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
            </div>
        </div>
    );

    const statCards = [
        { label: 'Enquêtes actives', value: surveys.filter(s => !s.has_responded).length, icon: ClipboardList, iconCls: 'text-blue-600', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Réponses envoyées', value: surveys.filter(s => s.has_responded).length, icon: CheckCircle, iconCls: 'text-green-600', iconBg: 'bg-green-100 dark:bg-green-900/30' },
        { label: 'Total enquêtes', value: surveys.length, icon: Users, iconCls: 'text-purple-600', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
    ];

    return (
        <div className={`flex h-screen ${d.page}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 ${d.text}`}>Enquêtes & Sondages</h1>
                            <p className={d.textMuted}>Votre opinion compte pour améliorer l'entreprise</p>
                        </div>
                        {user.role === 'admin' && (
                            <button onClick={() => navigate('/surveys/create')}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                <Plus className="w-5 h-5" />Créer une enquête
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {statCards.map(({ label, value, icon: Icon, iconCls, iconBg }) => (
                            <div key={label} className={`rounded-xl shadow-sm p-6 border ${d.card}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm mb-1 ${d.textMuted}`}>{label}</p>
                                        <p className={`text-3xl font-bold ${d.text}`}>{value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${iconCls}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Liste */}
                    {surveys.length === 0 ? (
                        <div className={`rounded-xl shadow-sm p-12 text-center border ${d.card}`}>
                            <ClipboardList className={`w-16 h-16 mx-auto mb-4 ${d.textMuted}`} />
                            <h3 className={`text-xl font-bold mb-2 ${d.text}`}>Aucune enquête disponible</h3>
                            <p className={d.textMuted}>Les enquêtes apparaîtront ici lorsqu'elles seront créées</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {surveys.map(survey => (
                                <div key={survey.id}
                                    className={`rounded-xl shadow-sm border-2 p-6 transition-all ${d.card} ${survey.has_responded ? 'opacity-75 border-green-500/40' : 'hover:shadow-lg hover:border-blue-400 cursor-pointer'}`}
                                    onClick={() => !survey.has_responded && handleOpenSurvey(survey)}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-bold mb-2 ${d.text}`}>{survey.title}</h3>
                                            <p className={`text-sm mb-3 ${d.textMuted}`}>{survey.description}</p>
                                        </div>
                                        {survey.has_responded && <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />}
                                    </div>
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(survey)}`}>
                                            {survey.has_responded ? 'Répondu' : 'En attente'}
                                        </span>
                                        {survey.anonymous && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                                                Anonyme
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                            {survey.questions.length} question{survey.questions.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className={`flex items-center text-sm ${d.textMuted} gap-4`}>
                                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>Jusqu'au {new Date(survey.deadline).toLocaleDateString('fr-FR')}</span></div>
                                        <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{survey.response_count} réponse{survey.response_count > 1 ? 's' : ''}</span></div>
                                    </div>
                                    {!survey.has_responded && (
                                        <button onClick={e => { e.stopPropagation(); handleOpenSurvey(survey); }}
                                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                                            Répondre maintenant
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal réponse */}
            {selectedSurvey && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className={`${d.modal} rounded-2xl p-8 w-full max-w-3xl my-8 border ${d.divider}`}>
                        <div className="mb-6">
                            <h2 className={`text-2xl font-bold mb-2 ${d.text}`}>{selectedSurvey.title}</h2>
                            <p className={d.textMuted}>{selectedSurvey.description}</p>
                            {selectedSurvey.anonymous && (
                                <div className={`mt-4 rounded-lg p-3 border ${darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'}`}>
                                    <p className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                        🔒 Cette enquête est anonyme. Vos réponses ne seront pas associées à votre identité.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto">
                            {selectedSurvey.questions.map((q, i) => (
                                <div key={i} className={`border rounded-lg p-4 ${d.divider} ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                    <h3 className={`font-semibold mb-3 ${d.text}`}>
                                        {i + 1}. {q.text}{q.required && <span className="text-red-500 ml-1">*</span>}
                                    </h3>

                                    {q.type === 'single_choice' && q.options.map((opt, j) => (
                                        <label key={j} className={`flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer transition ${d.divider} ${d.optHover}`}>
                                            <input type="radio" name={`q-${i}`} value={opt} checked={answers[i] === opt} onChange={e => handleAnswerChange(i, e.target.value)} className="w-4 h-4 text-blue-600" />
                                            <span className={d.textMuted}>{opt}</span>
                                        </label>
                                    ))}

                                    {q.type === 'multiple_choice' && q.options.map((opt, j) => (
                                        <label key={j} className={`flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer transition ${d.divider} ${d.optHover}`}>
                                            <input type="checkbox" value={opt}
                                                checked={Array.isArray(answers[i]) && answers[i].includes(opt)}
                                                onChange={e => {
                                                    const cur = Array.isArray(answers[i]) ? answers[i] : [];
                                                    handleAnswerChange(i, e.target.checked ? [...cur, opt] : cur.filter(v => v !== opt));
                                                }} className="w-4 h-4 text-blue-600 rounded" />
                                            <span className={d.textMuted}>{opt}</span>
                                        </label>
                                    ))}

                                    {q.type === 'scale' && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {[...Array(q.max || 5)].map((_, k) => (
                                                <button key={k} onClick={() => handleAnswerChange(i, String(k + 1))}
                                                    className={`w-12 h-12 rounded-lg font-bold transition ${answers[i] === String(k + 1) ? 'bg-blue-600 text-white' : d.scaleBtn}`}>
                                                    {k + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'text' && (
                                        <textarea value={answers[i] || ''} onChange={e => handleAnswerChange(i, e.target.value)} rows="4" placeholder="Votre réponse..."
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${d.input}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSelectedSurvey(null)} className={`flex-1 px-6 py-3 border rounded-lg font-semibold transition ${d.cancelBtn}`}>Annuler</button>
                            <button onClick={handleSubmitSurvey} disabled={submitting} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                                {submitting ? 'Envoi...' : 'Envoyer mes réponses'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}