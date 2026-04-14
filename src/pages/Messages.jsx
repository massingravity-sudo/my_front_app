import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { messagesAPI } from '../services/api';
import { Send, Search, Users, MessageCircle, Paperclip, Check, CheckCheck, X } from 'lucide-react';

export default function Messages() {
    const { user } = useAuth();
    const { darkMode } = useApp();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const messagesEndRef = useRef(null);

    // ── Palette dark/light ─────────────────────────────────
    const d = darkMode ? {
        page: 'bg-slate-900',
        sidebar: 'bg-slate-800 border-slate-700',
        main: 'bg-slate-800',
        msgArea: 'bg-slate-900',
        border: 'border-slate-700',
        hdr: 'bg-slate-800 border-slate-700',
        input: 'bg-slate-700 border-slate-600 text-white placeholder-slate-400',
        text: 'text-slate-100',
        textMuted: 'text-slate-400',
        textSub: 'text-slate-500',
        convHover: 'hover:bg-slate-700',
        convActive: 'bg-slate-700 border-blue-500',
        convBorder: 'border-transparent',
        msgIn: 'bg-slate-700 text-slate-100 border-slate-600',
        btnIcon: 'hover:bg-slate-700 text-slate-400',
        modal: 'bg-slate-800 border-slate-700',
        modalResult: 'hover:bg-slate-700',
        badge: 'bg-blue-600 text-white',
        empty: 'text-slate-500',
        emptyIcon: 'text-slate-600',
    } : {
        page: 'bg-gray-50',
        sidebar: 'bg-white border-gray-200',
        main: 'bg-white',
        msgArea: 'bg-gray-50',
        border: 'border-gray-200',
        hdr: 'bg-white border-gray-200',
        input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        textSub: 'text-gray-500',
        convHover: 'hover:bg-gray-50',
        convActive: 'bg-blue-50 border-blue-600',
        convBorder: 'border-transparent',
        msgIn: 'bg-white text-gray-900 border-gray-200',
        btnIcon: 'hover:bg-gray-100 text-gray-600',
        modal: 'bg-white',
        modalResult: 'hover:bg-gray-50',
        badge: 'bg-blue-600 text-white',
        empty: 'text-gray-500',
        emptyIcon: 'text-gray-400',
    };

    useEffect(() => { loadConversations(); }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            const iv = setInterval(() => loadMessages(selectedConversation.id), 3000);
            return () => clearInterval(iv);
        }
    }, [selectedConversation]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const loadConversations = async () => {
        try { const r = await messagesAPI.getConversations(); setConversations(r.data); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const loadMessages = async (id) => {
        try {
            const r = await messagesAPI.getMessages(id);
            setMessages(r.data);
            for (const m of r.data.filter(m => m.sender_id !== user.id && !m.read))
                await messagesAPI.markAsRead(m.id);
        } catch (e) { console.error(e); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;
        setSending(true);
        try {
            const r = await messagesAPI.sendMessage({ conversation_id: selectedConversation.id, content: newMessage.trim() });
            setMessages([...messages, r.data]);
            setNewMessage('');
            loadConversations();
        } catch (e) { console.error(e); }
        finally { setSending(false); }
    };

    const handleSearchUsers = async (q) => {
        setSearchQuery(q);
        if (q.length < 2) { setSearchResults([]); return; }
        try { const r = await messagesAPI.searchUsers(q); setSearchResults(r.data); }
        catch (e) { console.error(e); }
    };

    const handleStartConversation = async (userId) => {
        try {
            const r = await messagesAPI.getOrCreateConversation(userId);
            await loadConversations();
            setSelectedConversation(conversations.find(c => c.id === r.data.id) || r.data);
            setShowNewChat(false); setSearchQuery(''); setSearchResults([]);
        } catch (e) { console.error(e); }
    };

    const formatTime = (ds) => {
        const d = new Date(ds), now = new Date();
        const min = Math.floor((now - d) / 60000);
        const h = Math.floor((now - d) / 3600000);
        const day = Math.floor((now - d) / 86400000);
        if (min < 1) return "À l'instant";
        if (min < 60) return `${min}m`;
        if (h < 24) return `${h}h`;
        if (day < 7) return `${day}j`;
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className={`flex h-screen ${d.page}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <div className="flex-1 flex overflow-hidden">

                    {/* Liste conversations */}
                    <div className={`w-80 ${d.sidebar} border-r flex flex-col`}>
                        <div className={`p-4 border-b ${d.border}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-xl font-bold ${d.text}`}>Messages</h2>
                                <button onClick={() => setShowNewChat(true)} className={`p-2 rounded-lg transition ${d.btnIcon}`}>
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${d.textSub}`} />
                                <input type="text" placeholder="Rechercher..."
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${d.input}`} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className={`p-4 text-center ${d.textMuted}`}>Chargement...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageCircle className={`w-12 h-12 mx-auto mb-3 ${d.emptyIcon}`} />
                                    <p className={d.empty}>Aucune conversation</p>
                                    <button onClick={() => setShowNewChat(true)} className="mt-4 text-blue-500 hover:text-blue-400 font-medium text-sm">
                                        Démarrer une conversation
                                    </button>
                                </div>
                            ) : conversations.map(conv => (
                                <button key={conv.id} onClick={() => setSelectedConversation(conv)}
                                    className={`w-full p-4 flex items-start gap-3 transition border-l-4 ${selectedConversation?.id === conv.id ? d.convActive : `${d.convBorder} ${d.convHover}`}`}>
                                    <div className="flex-shrink-0">
                                        {conv.type === 'group'
                                            ? <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div>
                                            : <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-lg">{conv.name.charAt(0).toUpperCase()}</span></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-semibold truncate ${d.text}`}>{conv.name}</h3>
                                            {conv.last_message && <span className={`text-xs ${d.textSub}`}>{formatTime(conv.last_message.created_at)}</span>}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${d.textMuted}`}>{conv.last_message ? conv.last_message.content : 'Aucun message'}</p>
                                            {conv.unread_count > 0 && <span className={`${d.badge} text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>{conv.unread_count}</span>}
                                        </div>
                                        <p className={`text-xs mt-1 ${d.textSub}`}>{conv.department}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zone chat */}
                    <div className={`flex-1 flex flex-col ${d.main}`}>
                        {selectedConversation ? (<>
                            <div className={`p-4 border-b ${d.border} flex items-center gap-3`}>
                                {selectedConversation.type === 'group'
                                    ? <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-white" /></div>
                                    : <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"><span className="text-white font-bold">{selectedConversation.name.charAt(0).toUpperCase()}</span></div>
                                }
                                <div>
                                    <h3 className={`font-bold ${d.text}`}>{selectedConversation.name}</h3>
                                    <p className={`text-sm ${d.textSub}`}>{selectedConversation.department}</p>
                                </div>
                            </div>

                            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${d.msgArea}`}>
                                {messages.map(msg => {
                                    const isOwn = msg.sender_id === user.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-md">
                                                {!isOwn && <p className={`text-xs mb-1 px-3 ${d.textMuted}`}>{msg.sender?.full_name}</p>}
                                                <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-600 text-white' : `${d.msgIn} border`}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                        <span className={`text-xs ${isOwn ? 'text-blue-100' : d.textSub}`}>{formatTime(msg.created_at)}</span>
                                                        {isOwn && (msg.read ? <CheckCheck className="w-3 h-3 text-blue-100" /> : <Check className="w-3 h-3 text-blue-100" />)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className={`p-4 border-t ${d.border} ${d.main}`}>
                                <div className="flex items-center gap-2">
                                    <button type="button" className={`p-2 rounded-lg transition ${d.btnIcon}`}><Paperclip className="w-5 h-5" /></button>
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre message..."
                                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${d.input}`} />
                                    <button type="submit" disabled={!newMessage.trim() || sending}
                                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${d.emptyIcon}`} />
                                    <p className={`text-lg font-medium ${d.textMuted}`}>Sélectionnez une conversation</p>
                                    <p className={`text-sm ${d.textSub}`}>ou démarrez une nouvelle discussion</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal nouvelle conversation */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className={`${d.modal} rounded-2xl p-6 w-full max-w-md border ${d.border}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-xl font-bold ${d.text}`}>Nouvelle conversation</h3>
                            <button onClick={() => { setShowNewChat(false); setSearchQuery(''); setSearchResults([]); }}
                                className={`p-2 rounded-lg transition ${d.btnIcon}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative mb-4">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${d.textSub}`} />
                            <input type="text" value={searchQuery} onChange={e => handleSearchUsers(e.target.value)}
                                placeholder="Rechercher un collègue..." autoFocus
                                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${d.input}`} />
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {searchResults.map(u => (
                                <button key={u.id} onClick={() => handleStartConversation(u.id)}
                                    className={`w-full p-3 flex items-center gap-3 rounded-lg transition text-left ${d.modalResult}`}>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">{u.full_name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold ${d.text}`}>{u.full_name}</h4>
                                        <p className={`text-sm ${d.textMuted}`}>{u.department} · {u.position}</p>
                                    </div>
                                </button>
                            ))}
                            {searchQuery.length >= 2 && searchResults.length === 0 && (
                                <p className={`text-center py-8 ${d.empty}`}>Aucun résultat trouvé</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}