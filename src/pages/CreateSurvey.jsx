import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { surveysAPI } from '../services/api';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function CreateSurvey() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_department: 'all',
        anonymous: false,
        deadline: '',
        show_results: false,
        questions: []
    });
    const [submitting, setSubmitting] = useState(false);

    const questionTypes = [
        { value: 'single_choice', label: 'Choix unique' },
        { value: 'multiple_choice', label: 'Choix multiples' },
        { value: 'scale', label: 'Échelle (1-5)' },
        { value: 'text', label: 'Texte libre' }
    ];

    const departments = ['all', 'IT', 'RH', 'Finance', 'Marketing', 'Commercial', 'Production', 'Logistique'];

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    text: '',
                    type: 'single_choice',
                    required: true,
                    options: ['Option 1', 'Option 2']
                }
            ]
        });
    };

    const removeQuestion = (index) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_, i) => i !== index)
        });
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[questionIndex].options.push(`Option ${newQuestions[questionIndex].options.length + 1}`);
        setFormData({ ...formData, questions: newQuestions });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        setFormData({ ...formData, questions: newQuestions });
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.questions.length === 0) {
            alert('Ajoutez au moins une question');
            return;
        }

        setSubmitting(true);
        try {
            await surveysAPI.create(formData);
            alert('Enquête créée avec succès !');
            navigate('/surveys');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la création');
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 overflow-y-auto p-6">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/surveys')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour aux enquêtes
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📝 Créer une enquête
                        </h1>
                        <p className="text-gray-600">
                            Recueillez l'avis de vos employés
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-4xl">

                        {/* Informations générales */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre de l'enquête *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enquête de satisfaction 2025"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Aidez-nous à améliorer l'entreprise..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Département cible
                                        </label>
                                        <select
                                            value={formData.target_department}
                                            onChange={(e) => setFormData({ ...formData, target_department: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>
                                                    {dept === 'all' ? 'Toute l\'entreprise' : dept}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date limite *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.anonymous}
                                            onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            Enquête anonyme
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.show_results}
                                            onChange={(e) => setFormData({ ...formData, show_results: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            Montrer les résultats aux participants
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter une question
                                </button>
                            </div>

                            {formData.questions.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-600">Aucune question ajoutée</p>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Ajouter votre première question
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="border border-gray-300 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-gray-900">Question {qIndex + 1}</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="text-red-600 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={question.text}
                                                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Texte de la question"
                                                    required
                                                />

                                                <div className="grid grid-cols-2 gap-3">
                                                    <select
                                                        value={question.type}
                                                        onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg"
                                                    >
                                                        {questionTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={question.required}
                                                            onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 rounded"
                                                        />
                                                        <span className="text-sm text-gray-700">Obligatoire</span>
                                                    </label>
                                                </div>

                                                {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
                                                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                                                        <p className="text-sm font-semibold text-gray-700">Options:</p>
                                                        {question.options.map((option, oIndex) => (
                                                            <div key={oIndex} className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={option}
                                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                                    placeholder={`Option ${oIndex + 1}`}
                                                                />
                                                                {question.options.length > 2 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                                        className="text-red-600 hover:text-red-700 p-1"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => addOption(qIndex)}
                                                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                                        >
                                                            + Ajouter une option
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/surveys')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || formData.questions.length === 0}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {submitting ? 'Création...' : 'Créer l\'enquête'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}