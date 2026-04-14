import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { postsAPI } from '../services/api';
import { Plus, X, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import FileUpload from '../components/FileUpload';

export default function Posts() {
  const { user } = useAuth();
  const { darkMode } = useApp();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'general', department: 'all', attachments: [] });

  // ── Palette ────────────────────────────────────────────
  const d = darkMode ? {
    page: 'bg-slate-900',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    card: 'bg-slate-800 border-slate-700',
    input: 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400',
    label: 'text-slate-300',
    modal: 'bg-slate-800 border-slate-700',
    divider: 'border-slate-700',
    footer: 'bg-slate-700 border-slate-600',
    btnAct: 'text-slate-300 hover:text-blue-400',
    hint: 'bg-blue-900/30 border-blue-700 text-blue-300',
  } : {
    page: 'bg-gray-50',
    text: 'text-gray-800',
    textMuted: 'text-gray-600',
    card: 'bg-white border-gray-200',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    label: 'text-gray-700',
    modal: 'bg-white border-gray-200',
    divider: 'border-gray-200',
    footer: 'bg-gray-50 border-gray-200',
    btnAct: 'text-gray-600 hover:text-blue-600',
    hint: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try { const r = await postsAPI.getAll(); setPosts(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.create(formData);
      setShowModal(false);
      setFormData({ title: '', content: '', type: 'general', department: 'all', attachments: [] });
      loadPosts();
      alert('Publication créée avec succès !');
    } catch { alert('Erreur lors de la création'); }
  };

  const handleLike = async (id) => {
    try { await postsAPI.like(id); loadPosts(); } catch (e) { console.error(e); }
  };

  const getTypeColor = (type) => {
    if (darkMode) {
      return { general: 'border-l-blue-400 bg-slate-800', announcement: 'border-l-yellow-400 bg-slate-800', success: 'border-l-green-400 bg-slate-800', urgent: 'border-l-red-400 bg-slate-800' }[type] || 'border-l-blue-400 bg-slate-800';
    }
    return { general: 'border-l-blue-500 bg-blue-50', announcement: 'border-l-yellow-500 bg-yellow-50', success: 'border-l-green-500 bg-green-50', urgent: 'border-l-red-500 bg-red-50' }[type] || 'border-l-blue-500 bg-blue-50';
  };

  const getTypeBadge = (type) => {
    const badges = {
      general: { label: '📌 Général', color: darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700' },
      announcement: { label: '📢 Annonce', color: darkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-100 text-yellow-700' },
      success: { label: '✅ Succès', color: darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700' },
      urgent: { label: '🚨 Urgent', color: darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700' },
    };
    return badges[type] || badges.general;
  };

  const inputCls = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${d.input}`;

  return (
    <div className={`flex h-screen ${d.page}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${d.text}`}>Fil d'Actualités</h1>
                <p className={d.textMuted}>
                  {user?.role === 'admin' ? 'Partagez des actualités avec vos équipes' : 'Restez informé des actualités de votre département'}
                </p>
              </div>
              {user?.role === 'admin' && (
                <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-5 h-5" /><span>Publier</span>
                </button>
              )}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <p className={`text-xl ${d.textMuted}`}>Aucune actualité pour le moment</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike}
                    getTypeColor={getTypeColor} getTypeBadge={getTypeBadge} d={d} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border ${d.modal}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${d.text}`}>📝 Nouvelle Publication</h2>
              <button onClick={() => setShowModal(false)}><X className={`w-6 h-6 ${d.textMuted}`} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Titre *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className={inputCls} placeholder="Ex: Nouvelle politique de télétravail" required />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Contenu *</label>
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className={inputCls} rows={5} placeholder="Rédigez votre message..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className={inputCls}>
                    <option value="general">📌 Général</option>
                    <option value="announcement">📢 Annonce</option>
                    <option value="success">✅ Succès</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${d.label}`}>Département</label>
                  <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className={inputCls}>
                    <option value="all">Tous les départements</option>
                    <option value="IT">IT</option>
                    <option value="RH">RH</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${d.label}`}>📎 Images et Fichiers</label>
                <FileUpload onUploadComplete={files => setFormData({ ...formData, attachments: files })} accept="image/*,application/pdf,.doc,.docx" />
              </div>
              <div className={`p-4 rounded-lg border ${d.hint}`}>
                <p className="text-sm"><strong>💡 Astuce :</strong> Les actualités "Urgent" enverront des notifications immédiates.</p>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Publier l'Actualité
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, getTypeColor, getTypeBadge, d }) {
  const badge = getTypeBadge(post.type);
  return (
    <div className={`rounded-lg shadow-md border-l-4 ${getTypeColor(post.type)} overflow-hidden border ${d.card}`}>
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {post.author.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className={`font-semibold ${d.text}`}>{post.author.full_name}</h3>
              <p className={`text-sm ${d.textMuted}`}>{new Date(post.created_at).toLocaleString('fr-FR')}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>
        </div>
        <h2 className={`text-xl font-bold mb-3 ${d.text}`}>{post.title}</h2>
        <p className={`whitespace-pre-wrap ${d.textMuted}`}>{post.content}</p>
      </div>

      {post.attachments?.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {post.attachments.map((file, i) => (
              <a key={i} href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition ${d.footer}`}>
                {file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                  ? <img src={`http://localhost:5000${file.url}`} alt={file.name} className="w-full h-48 object-cover rounded" />
                  : <><span className="text-2xl">📎</span><span className={`text-sm truncate ${d.textMuted}`}>{file.name}</span></>
                }
              </a>
            ))}
          </div>
        </div>
      )}

      <div className={`border-t px-6 py-3 flex items-center justify-between ${d.footer}`}>
        <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 transition ${d.btnAct}`}>
          <ThumbsUp className="w-5 h-5" /><span className="text-sm font-semibold">{post.likes || 0} J'aime</span>
        </button>
        <button className={`flex items-center gap-2 transition ${d.btnAct}`}>
          <MessageCircle className="w-5 h-5" /><span className="text-sm font-semibold">{post.comments?.length || 0} Commentaires</span>
        </button>
        <button className={`flex items-center gap-2 transition ${d.btnAct}`}>
          <Share2 className="w-5 h-5" /><span className="text-sm font-semibold">Partager</span>
        </button>
      </div>
    </div>
  );
}