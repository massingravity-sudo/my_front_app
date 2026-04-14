import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { tasksAPI, usersAPI } from '../services/api';
import { Plus, X } from 'lucide-react';
import FileUpload from '../components/FileUpload';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    department: user?.department || '',
    assigned_to_id: null,
    deadline: '',
    attachments: []
  });

  useEffect(() => {
    loadTasks();
    if (user?.role === 'admin') {
      loadUsers();
    }
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        department: user?.department || '',
        assigned_to_id: null,
        deadline: '',
        attachments: []
      });
      loadTasks();
      alert('Tâche créée avec succès !');
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const columns = [
    { id: 'todo', title: 'À Faire', color: 'border-gray-500' },
    { id: 'in_progress', title: 'En Cours', color: 'border-blue-500' },
    { id: 'done', title: 'Terminées', color: 'border-green-500' },
    { id: 'blocked', title: 'Bloquées', color: 'border-red-500' }
  ];

  const getTasksByColumn = (columnId) => {
    return tasks.filter(t => t.status === columnId);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: ' Basse',
      medium: ' Moyenne',
      high: ' Haute',
      urgent: ' Urgente'
    };
    return labels[priority] || priority;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-hidden p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestion des Tâches
              </h1>
              <p className="text-gray-600">
                {user?.role === 'admin' ? 'Créez et gérez les tâches' : 'Vos tâches assignées'}
              </p>
            </div>

            {user?.role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle Tâche</span>
              </button>
            )}
          </div>

          {/* Kanban Board */}
          <div className="h-full overflow-x-auto pb-6">
            <div className="flex space-x-4 h-full min-w-max">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className={`bg-white rounded-lg p-4 h-full flex flex-col border-t-4 ${column.color}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700">{column.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                        {getTasksByColumn(column.id).length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {getTasksByColumn(column.id).map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={updateTaskStatus}
                          currentStatus={column.id}
                          columns={columns}
                          getPriorityColor={getPriorityColor}
                          getPriorityLabel={getPriorityLabel}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Création Tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800"> Nouvelle Tâche</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >

                    <option value="medium">🟡 Moyenne</option>
                    <option value="high">🟠 Haute</option>
                    <option value="urgent"> Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Département *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="IT">IT</option>
                    <option value="RH">RH</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigner à (optionnel)
                  </label>
                  <select
                    value={formData.assigned_to_id || ''}
                    onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Tout le département --</option>
                    {users.filter(u => u.department === formData.department).map(u => (
                      <option key={u.id} value={u.id}>{u.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date limite
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pièces jointes
                </label>
                <FileUpload
                  onUploadComplete={(files) => setFormData({ ...formData, attachments: files })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Créer la Tâche
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onStatusChange, currentStatus, columns, getPriorityColor, getPriorityLabel }) {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">{task.code}</div>
          <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {getPriorityLabel(task.priority).split(' ')[0]}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
      )}

      {task.deadline && (
        <div className="text-xs text-gray-500 mb-3">
          {new Date(task.deadline).toLocaleDateString('fr-FR')}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white">
            {getInitials(task.created_by?.full_name)}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Changer statut ▼
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-40">
              {columns.filter(c => c.id !== currentStatus).map(col => (
                <button
                  key={col.id}
                  onClick={() => {
                    onStatusChange(task.id, col.id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {col.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}