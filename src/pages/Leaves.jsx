import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { leavesAPI } from '../services/api';
import { Plus, X, Check, XCircle, Clock } from 'lucide-react';

export default function Leaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'vacation',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const response = await leavesAPI.getAll();
      setLeaves(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leavesAPI.create(formData);
      setShowModal(false);
      setFormData({
        type: 'vacation',
        start_date: '',
        end_date: '',
        reason: ''
      });
      loadLeaves();
      alert('Demande de congé soumise avec succès !');
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleReview = async (leaveId, status) => {
    try {
      await leavesAPI.review(leaveId, status);
      loadLeaves();
      alert(`Demande ${status === 'approved' ? 'approuvée' : 'rejetée'} !`);
    } catch (error) {
      alert('Erreur lors de la révision');
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      vacation: ' Vacances',
      sick: ' Maladie',
      personal: ' Personnel',
      other: ' Autre'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> },
      approved: { label: 'Approuvé', color: 'bg-green-100 text-green-700', icon: <Check className="w-4 h-4" /> },
      rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> }
    };
    return badges[status] || badges.pending;
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filtrer les congés
  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestion des Congés
              </h1>
              <p className="text-gray-600">
                {user?.role === 'admin'
                  ? 'Gérez les demandes de congés de vos équipes'
                  : 'Consultez et demandez vos congés'}
              </p>
            </div>

            {user?.role === 'employee' && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Demander un Congé</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">En Attente</p>
                      <p className="text-3xl font-bold text-yellow-600">{pendingLeaves.length}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Approuvés</p>
                      <p className="text-3xl font-bold text-green-600">{approvedLeaves.length}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rejetés</p>
                      <p className="text-3xl font-bold text-red-600">{rejectedLeaves.length}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demandes en Attente (Admin) */}
              {user?.role === 'admin' && pendingLeaves.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Demandes en Attente d'Approbation
                  </h2>
                  <div className="space-y-4">
                    {pendingLeaves.map((leave) => (
                      <LeaveCardAdmin
                        key={leave.id}
                        leave={leave}
                        onReview={handleReview}
                        getTypeLabel={getTypeLabel}
                        calculateDays={calculateDays}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Toutes les Demandes */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📋 {user?.role === 'admin' ? 'Historique des Demandes' : 'Mes Demandes'}
                </h2>
                {leaves.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-lg">
                    <div className="text-6xl mb-4"></div>
                    <p className="text-xl text-gray-600">Aucune demande de congé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaves.map((leave) => (
                      <LeaveCard
                        key={leave.id}
                        leave={leave}
                        getTypeLabel={getTypeLabel}
                        getStatusBadge={getStatusBadge}
                        calculateDays={calculateDays}
                        isAdmin={user?.role === 'admin'}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Demande de Congé */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800"> Demande de Congé</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de Congé *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="vacation">Vacances</option>
                  <option value="sick"> Maladie</option>
                  <option value="personal">Personnel</option>
                  <option value="other"> Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de Début *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de Fin *
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min={formData.start_date}
                  />
                </div>
              </div>

              {formData.start_date && formData.end_date && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Durée :</strong> {calculateDays(formData.start_date, formData.end_date)} jour(s)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Motif / Commentaire
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Expliquez brièvement votre demande..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Soumettre la Demande
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaveCardAdmin({ leave, onReview, getTypeLabel, calculateDays }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {leave.employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{leave.employee.full_name}</h3>
              <p className="text-sm text-gray-600">{leave.employee.department}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Type :</strong> {getTypeLabel(leave.type)}</p>
            <p><strong>Période :</strong> {new Date(leave.start_date).toLocaleDateString('fr-FR')} → {new Date(leave.end_date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Durée :</strong> {calculateDays(leave.start_date, leave.end_date)} jour(s)</p>
            {leave.reason && <p><strong>Motif :</strong> {leave.reason}</p>}
            <p className="text-gray-500">
              Demandé le {new Date(leave.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onReview(leave.id, 'approved')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Approuver</span>
          </button>
          <button
            onClick={() => onReview(leave.id, 'rejected')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Rejeter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function LeaveCard({ leave, getTypeLabel, getStatusBadge, calculateDays, isAdmin }) {
  const badge = getStatusBadge(leave.status);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isAdmin && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {leave.employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <span className="font-semibold text-gray-800">{leave.employee.full_name}</span>
              <span className="text-sm text-gray-500">({leave.employee.department})</span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeLabel(leave.type).split(' ')[0]}</span>
            <div>
              <p className="font-semibold text-gray-800">{getTypeLabel(leave.type)}</p>
              <p className="text-sm text-gray-600">
                {new Date(leave.start_date).toLocaleDateString('fr-FR')} → {new Date(leave.end_date).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-gray-500">
                {calculateDays(leave.start_date, leave.end_date)} jour(s)
              </p>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${badge.color}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {leave.reason && (
        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-gray-700">
            <strong>Motif :</strong> {leave.reason}
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Demandé le {new Date(leave.created_at).toLocaleString('fr-FR')}</p>
        {leave.reviewed_at && (
          <p>
            {leave.status === 'approved' ? 'Approuvé' : 'Rejeté'} le {new Date(leave.reviewed_at).toLocaleString('fr-FR')}
            {leave.reviewed_by && ` par ${leave.reviewed_by}`}
          </p>
        )}
      </div>
    </div>
  );
}