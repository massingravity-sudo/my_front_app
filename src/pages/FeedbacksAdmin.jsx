import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { feedbacksAPI } from '../services/api';
import { MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, Send } from 'lucide-react';

export default function FeedbacksAdmin() {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [feedbacksRes, statsRes] = await Promise.all([
                feedbacksAPI.getAll(),
                feedbacksAPI.getStats()
            ]);
            setFeedbacks(feedbacksRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (feedbackId, newStatus) => {
        if (!responseMessage.trim()) {
            alert('Veuillez écrire une réponse');
            return;
        }

        try {
            await feedbacksAPI.respond(feedbackId, {
                message: responseMessage,
                status: newStatus
            });
            setResponseMessage('');
            setSelectedFeedback(null);
            loadData();
            alert('Réponse envoyée !');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'envoi');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'suggestion': 'bg-blue-100 text-blue-800 border-blue-200',
            'probleme': 'bg-red-100 text-red-800 border-red-200',
            'idee': 'bg-purple-100 text-purple-800 border-purple-200',
            'autre': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[category] || colors.autre;
    };

    const getSentimentColor = (sentiment) => {
        const colors = {
            'positive': 'bg-green-100 text-green-800',
            'neutral': 'bg-gray-100 text-gray-800',
            'negative': 'bg-red-100 text-red-800'
        };
        return colors[sentiment] || colors.neutral;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'new': <Clock className="w-4 h-4" />,
            'in_progress': <AlertCircle className="w-4 h-4" />,
            'resolved': <CheckCircle className="w-4 h-4" />,
            'archived': <CheckCircle className="w-4 h-4" />
        };
        return icons[status] || icons.new;
    };

    const filteredFeedbacks = filter === 'all'
        ? feedbacks
        : feedbacks.filter(f => f.status === filter);

    if (user.role !== 'admin') {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
                        <p className="text-gray-600">Cette page est réservée aux administrateurs</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-6">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            💬 Gestion des Feedbacks
                        </h1>
                        <p className="text-gray-600">
                            Analysez et répondez aux feedbacks anonymes des employés
                        </p>
                    </div>

                    {/* Statistiques */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total feedbacks</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Nouveaux</p>
                                        <p className="text-3xl font-bold text-orange-600">{stats.by_status.new || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">En cours</p>
                                        <p className="text-3xl font-bold text-blue-600">{stats.by_status.in_progress || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Résolus</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.by_status.resolved || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistiques détaillées */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                            {/* Par catégorie */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    Par catégorie
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.by_category).map(([category, count]) => (
                                        <div key={category} className="flex items-center justify-between">
                                            <span className="text-gray-700 capitalize">{category}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${(count / stats.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Par sentiment */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Analyse de sentiment
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Positif</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${(stats.by_sentiment.positive / stats.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-green-600 w-8 text-right">{stats.by_sentiment.positive}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Neutre</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gray-600 h-2 rounded-full"
                                                    style={{ width: `${(stats.by_sentiment.neutral / stats.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-gray-600 w-8 text-right">{stats.by_sentiment.neutral}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700">Négatif</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-red-600 h-2 rounded-full"
                                                    style={{ width: `${(stats.by_sentiment.negative / stats.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-bold text-red-600 w-8 text-right">{stats.by_sentiment.negative}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filtres */}
                    <div className="flex gap-2 mb-6">
                        {['all', 'new', 'in_progress', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'all' && 'Tous'}
                                {status === 'new' && 'Nouveaux'}
                                {status === 'in_progress' && 'En cours'}
                                {status === 'resolved' && 'Résolus'}
                            </button>
                        ))}
                    </div>

                    {/* Liste des feedbacks */}
                    {filteredFeedbacks.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Aucun feedback
                            </h3>
                            <p className="text-gray-600">
                                {filter === 'all' ? 'Aucun feedback pour le moment' : `Aucun feedback ${filter}`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFeedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(feedback.category)}`}>
                                                    {feedback.category}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(feedback.sentiment)}`}>
                                                    {feedback.sentiment === 'positive' && '😊 Positif'}
                                                    {feedback.sentiment === 'neutral' && '😐 Neutre'}
                                                    {feedback.sentiment === 'negative' && '😟 Négatif'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {feedback.department} • {new Date(feedback.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {feedback.title}
                                            </h3>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {feedback.content}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {getStatusIcon(feedback.status)}
                                            <span className="text-sm font-semibold text-gray-700 capitalize">
                                                {feedback.status === 'new' && 'Nouveau'}
                                                {feedback.status === 'in_progress' && 'En cours'}
                                                {feedback.status === 'resolved' && 'Résolu'}
                                                {feedback.status === 'archived' && 'Archivé'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Réponses existantes */}
                                    {feedback.responses && feedback.responses.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                            {feedback.responses.map((resp, index) => (
                                                <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-blue-900">{resp.admin}</span>
                                                        <span className="text-xs text-blue-700">
                                                            {new Date(resp.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-blue-800 text-sm">{resp.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bouton répondre */}
                                    {feedback.status !== 'resolved' && (
                                        <div className="mt-4">
                                            {selectedFeedback?.id === feedback.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={responseMessage}
                                                        onChange={(e) => setResponseMessage(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        rows="3"
                                                        placeholder="Votre réponse..."
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRespond(feedback.id, 'in_progress')}
                                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                                        >
                                                            Marquer en cours
                                                        </button>
                                                        <button
                                                            onClick={() => handleRespond(feedback.id, 'resolved')}
                                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                                        >
                                                            Marquer résolu
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedFeedback(null);
                                                                setResponseMessage('');
                                                            }}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedFeedback(feedback)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Répondre
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}