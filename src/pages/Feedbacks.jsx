import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { feedbacksAPI } from '../services/api';
import { MessageSquare, Lightbulb, AlertTriangle, Send } from 'lucide-react';

export default function Feedbacks() {
    const { user } = useAuth();
    const { darkMode } = useApp();

    const [formData, setFormData] = useState({ category: 'suggestion', title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // ── Palette ────────────────────────────────────────────
    const d = darkMode ? {
        page: 'bg-slate-900',
        text: 'text-slate-100',
        textMuted: 'text-slate-400',
        card: 'bg-slate-800 border-slate-700',
        input: 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-blue-500 focus:outline-none',
        label: 'text-slate-300',
        catBtn: 'border-slate-600 hover:border-slate-500',
        anon: 'bg-purple-900/20 border-purple-700 text-purple-300',
        success: 'bg-green-900/20 border-green-700 text-green-300',
        examples: 'bg-slate-700 border-slate-600',
        exTxt: 'text-slate-300',
        exTitle: 'text-slate-200',
    } : {
        page: 'bg-gray-50',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        card: 'bg-white border-gray-200',
        input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:outline-none',
        label: 'text-gray-700',
        catBtn: 'border-gray-200 hover:border-gray-300',
        anon: 'bg-purple-50 border-purple-200 text-purple-800',
        success: 'bg-green-50 border-green-200 text-green-900',
        examples: 'bg-gray-50 border-gray-200',
        exTxt: 'text-gray-700',
        exTitle: 'text-gray-900',
    };

    const categories = [
        { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'blue' },
        { value: 'probleme', label: 'Problème', icon: AlertTriangle, color: 'red' },
        { value: 'idee', label: 'Idée', icon: MessageSquare, color: 'purple' },
        { value: 'autre', label: 'Autre', icon: MessageSquare, color: 'gray' },
    ];

    // Couleurs par catégorie selon le mode
    const catColors = {
        blue: { active: darkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-500 bg-blue-50', icon: darkMode ? 'text-blue-400' : 'text-blue-600', text: darkMode ? 'text-blue-300' : 'text-blue-900' },
        red: { active: darkMode ? 'border-red-500 bg-red-900/30' : 'border-red-500 bg-red-50', icon: darkMode ? 'text-red-400' : 'text-red-600', text: darkMode ? 'text-red-300' : 'text-red-900' },
        purple: { active: darkMode ? 'border-purple-500 bg-purple-900/30' : 'border-purple-500 bg-purple-50', icon: darkMode ? 'text-purple-400' : 'text-purple-600', text: darkMode ? 'text-purple-300' : 'text-purple-900' },
        gray: { active: darkMode ? 'border-slate-500 bg-slate-700' : 'border-gray-500 bg-gray-100', icon: darkMode ? 'text-slate-300' : 'text-gray-500', text: darkMode ? 'text-slate-200' : 'text-gray-900' },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await feedbacksAPI.create(formData);
            setSuccess(true);
            setFormData({ category: 'suggestion', title: '', content: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi");
        } finally { setSubmitting(false); }
    };

    const inputCls = `w-full px-4 py-3 border rounded-lg focus:ring-2 ${d.input}`;

    return (
        <div className={`flex h-screen ${d.page}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-3xl mx-auto">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                                <MessageSquare className="w-8 h-8 text-blue-500" />
                            </div>
                            <h1 className={`text-3xl font-bold mb-2 ${d.text}`}>💬 Boîte à Idées</h1>
                            <p className={d.textMuted}>
                                Partagez vos idées, suggestions et signalements de manière <strong>100% anonyme</strong>
                            </p>
                        </div>

                        {/* Succès */}
                        {success && (
                            <div className={`border-2 rounded-xl p-6 mb-6 ${d.success}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                                        <Send className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Feedback envoyé !</h3>
                                        <p className="text-sm">Votre message a été transmis de manière anonyme. Merci pour votre contribution !</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Anonymat */}
                        <div className={`border rounded-xl p-6 mb-6 ${d.anon}`}>
                            <h3 className="font-bold mb-2 flex items-center gap-2"><span className="text-2xl">🔒</span>Garantie d'anonymat</h3>
                            <p className="text-sm">
                                Vos feedbacks sont <strong>totalement anonymes</strong>. Aucune information permettant de vous identifier n'est collectée.
                                Exprimez-vous librement pour nous aider à améliorer l'entreprise.
                            </p>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className={`rounded-xl shadow-sm border p-6 ${d.card}`}>

                            {/* Catégorie */}
                            <div className="mb-6">
                                <label className={`block text-sm font-semibold mb-3 ${d.label}`}>Type de feedback</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map(cat => {
                                        const Icon = cat.icon;
                                        const cc = catColors[cat.color];
                                        const isSelected = formData.category === cat.value;
                                        return (
                                            <button key={cat.value} type="button"
                                                onClick={() => setFormData({ ...formData, category: cat.value })}
                                                className={`p-4 border-2 rounded-lg transition-all ${isSelected ? cc.active : d.catBtn}`}>
                                                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? cc.icon : d.textMuted}`} />
                                                <span className={`text-sm font-semibold ${isSelected ? cc.text : d.textMuted}`}>{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Titre */}
                            <div className="mb-4">
                                <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Titre</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className={inputCls} placeholder="Résumé en quelques mots..." required />
                            </div>

                            {/* Contenu */}
                            <div className="mb-6">
                                <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Message</label>
                                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className={inputCls} rows="6" placeholder="Décrivez votre suggestion, problème ou idée en détail..." required />
                                <p className={`text-xs mt-2 ${d.textMuted}`}>Minimum 20 caractères • Soyez constructif et précis</p>
                            </div>

                            {/* Bouton */}
                            <button type="submit" disabled={submitting || formData.content.length < 20}
                                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                                {submitting ? (
                                    <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Envoi en cours...</>
                                ) : (
                                    <><Send className="w-5 h-5" />Envoyer anonymement</>
                                )}
                            </button>
                        </form>

                        {/* Exemples */}
                        <div className={`mt-8 rounded-xl p-6 border ${d.examples}`}>
                            <h3 className={`font-bold mb-3 ${d.exTitle}`}>💡 Exemples de feedbacks utiles :</h3>
                            <div className={`space-y-2 text-sm ${d.exTxt}`}>
                                <p>• "Les réunions hebdomadaires pourraient être plus courtes et focalisées"</p>
                                <p>• "Le système de validation des congés est trop lent"</p>
                                <p>• "Proposition : mettre en place du télétravail le vendredi"</p>
                                <p>• "La climatisation est trop forte dans l'open space"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}