import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { archivesAPI, usersAPI } from '../services/api';
import {
    Upload,
    Download,
    Trash2,
    Edit,
    Search,
    Filter,
    FolderPlus,
    File,
    FileText,
    Image,
    Video,
    Archive,
    Share2,
    X,
    Check,
    AlertCircle
} from 'lucide-react';

export default function Archives() {
    const { user } = useAuth();
    const [folders, setFolders] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Modals
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Upload form
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFolderId, setUploadFolderId] = useState(null);
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadTags, setUploadTags] = useState('');

    // New folder form
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderParent, setNewFolderParent] = useState(null);

    // Share
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedFolder !== null) {
            loadDocuments();
        }
    }, [selectedFolder, searchQuery, filterType]);

    const loadData = async () => {
        try {
            const [foldersRes, docsRes] = await Promise.all([
                archivesAPI.getFolders(),
                archivesAPI.getDocuments()
            ]);
            setFolders(foldersRes.data);
            setDocuments(docsRes.data);

            if (user.role === 'admin') {
                const usersRes = await usersAPI.getAll();
                setAvailableUsers(usersRes.data);
            }
        } catch (error) {
            console.error('Erreur chargement archives:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDocuments = async () => {
        try {
            const params = {};
            if (selectedFolder !== null) params.folder_id = selectedFolder;
            if (searchQuery) params.search = searchQuery;
            if (filterType !== 'all') params.type = filterType;

            const response = await archivesAPI.getDocuments(params);
            setDocuments(response.data);
        } catch (error) {
            console.error('Erreur chargement documents:', error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            if (uploadFolderId) formData.append('folder_id', uploadFolderId);
            if (uploadDescription) formData.append('description', uploadDescription);
            if (uploadTags) formData.append('tags', uploadTags);

            await archivesAPI.uploadDocument(formData);

            setShowUploadModal(false);
            setUploadFile(null);
            setUploadDescription('');
            setUploadTags('');
            loadDocuments();

            alert('Document uploadé avec succès');
        } catch (error) {
            console.error('Erreur upload:', error);
            alert('Erreur lors de l\'upload du document');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            await archivesAPI.createFolder({
                name: newFolderName,
                parent_id: newFolderParent
            });

            setShowNewFolderModal(false);
            setNewFolderName('');
            setNewFolderParent(null);
            loadData();

            alert('Dossier créé avec succès');
        } catch (error) {
            console.error('Erreur création dossier:', error);
            alert('Erreur lors de la création du dossier');
        }
    };

    const handleDownload = async (doc) => {
        try {
            const response = await archivesAPI.downloadDocument(doc.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            alert('Erreur lors du téléchargement');
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

        try {
            await archivesAPI.deleteDocument(docId);
            loadDocuments();
            alert('Document supprimé');
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleShare = async () => {
        try {
            await archivesAPI.shareDocument(selectedDocument.id, selectedUsers);
            setShowShareModal(false);
            setSelectedDocument(null);
            setSelectedUsers([]);
            alert('Document partagé avec succès');
        } catch (error) {
            console.error('Erreur partage:', error);
            alert('Erreur lors du partage');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />;
        if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
        if (mimeType.includes('pdf')) return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const renderFolderTree = (foldersList, level = 0) => {
        return foldersList.map(folder => (
            <div key={folder.id}>
                <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 ${selectedFolder === folder.id ? 'bg-blue-50 border-l-4 border-blue-600 font-semibold' : ''
                        }`}
                    style={{ paddingLeft: `${16 + level * 20}px` }}
                >
                    <Archive className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">{folder.name}</span>
                    <span className="ml-auto text-xs text-slate-500">
                        ({folder.document_count || 0})
                    </span>
                </button>
                {folder.children && folder.children.length > 0 && (
                    <div>
                        {renderFolderTree(folder.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Chargement des archives...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <div className="flex-1 flex overflow-hidden">

                    {/* Sidebar dossiers */}
                    <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
                        <div className="p-4 border-b border-slate-200">
                            <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14pt' }}>
                                Arborescence
                            </h2>
                            {user.role === 'admin' && (
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="btn-primary w-full"
                                    style={{ fontSize: '12pt' }}
                                >
                                    <FolderPlus className="w-4 h-4" />
                                    <span>Nouveau Dossier</span>
                                </button>
                            )}
                        </div>

                        <div className="py-2">
                            <button
                                onClick={() => setSelectedFolder(null)}
                                className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2 ${selectedFolder === null ? 'bg-blue-50 border-l-4 border-blue-600 font-semibold' : ''
                                    }`}
                                style={{ fontSize: '12pt' }}
                            >
                                <Archive className="w-4 h-4 text-slate-600" />
                                <span>Tous les documents</span>
                            </button>
                            {renderFolderTree(folders)}
                        </div>
                    </div>

                    {/* Zone principale */}
                    <div className="flex-1 flex flex-col overflow-hidden">

                        {/* Barre d'actions */}
                        <div className="bg-white border-b border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-4">

                                {/* Recherche et filtres */}
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un document..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input-modern pl-10"
                                            style={{ fontSize: '12pt' }}
                                        />
                                    </div>

                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="input-modern"
                                        style={{ fontSize: '12pt' }}
                                    >
                                        <option value="all">Tous les types</option>
                                        <option value="image">Images</option>
                                        <option value="application">Documents</option>
                                        <option value="video">Vidéos</option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="btn-primary"
                                    style={{ fontSize: '12pt' }}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Téléverser</span>
                                </button>
                            </div>
                        </div>

                        {/* Liste des documents */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {documents.length === 0 ? (
                                <div className="text-center py-16">
                                    <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="font-bold text-slate-900 mb-2" style={{ fontSize: '14pt' }}>
                                        Aucun document
                                    </h3>
                                    <p className="text-slate-600" style={{ fontSize: '12pt' }}>
                                        {searchQuery ? 'Aucun résultat pour cette recherche' : 'Ce dossier est vide'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="card-modern p-4 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                                                    {getFileIcon(doc.mime_type)}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                        title="Télécharger"
                                                    >
                                                        <Download className="w-4 h-4 text-slate-600" />
                                                    </button>
                                                    {user.role === 'admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedDocument(doc);
                                                                    setShowShareModal(true);
                                                                }}
                                                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                                                                title="Partager"
                                                            >
                                                                <Share2 className="w-4 h-4 text-slate-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(doc.id)}
                                                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-semibold text-slate-900 mb-1 truncate" style={{ fontSize: '12pt' }}>
                                                {doc.name}
                                            </h3>

                                            {doc.description && (
                                                <p className="text-slate-600 text-xs mb-2 line-clamp-2">
                                                    {doc.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                                <span>{formatFileSize(doc.size)}</span>
                                                <span>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</span>
                                            </div>

                                            {doc.uploader && (
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Par {doc.uploader.full_name}
                                                </p>
                                            )}

                                            {doc.tags && doc.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {doc.tags.map((tag, i) => (
                                                        <span key={i} className="badge-modern badge-neutral text-xs">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Upload */}
            {showUploadModal && (
                <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
                    <div className="modal-professional w-full max-w-2xl">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-slate-900" style={{ fontSize: '14pt' }}>
                                    Téléverser un Document
                                </h2>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpload} className="p-6">
                            <div className="space-y-4">

                                <div className="form-group">
                                    <label className="form-label form-label-required">
                                        Fichier
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        className="input-modern"
                                        required
                                    />
                                    {uploadFile && (
                                        <p className="form-help-text">
                                            Fichier sélectionné : {uploadFile.name} ({formatFileSize(uploadFile.size)})
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Dossier de destination
                                    </label>
                                    <select
                                        value={uploadFolderId || ''}
                                        onChange={(e) => setUploadFolderId(e.target.value ? parseInt(e.target.value) : null)}
                                        className="input-modern"
                                    >
                                        <option value="">Racine</option>
                                        {folders.map(folder => (
                                            <option key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        value={uploadDescription}
                                        onChange={(e) => setUploadDescription(e.target.value)}
                                        className="input-modern"
                                        rows="3"
                                        placeholder="Description du document..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Tags (séparés par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTags}
                                        onChange={(e) => setUploadTags(e.target.value)}
                                        className="input-modern"
                                        placeholder="contrat, client, 2025"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="btn-secondary-professional flex-1"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !uploadFile}
                                    className="btn-primary-professional flex-1"
                                >
                                    {uploading ? 'Téléversement...' : 'Téléverser'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Nouveau Dossier */}
            {showNewFolderModal && (
                <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
                    <div className="modal-professional w-full max-w-md">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-slate-900" style={{ fontSize: '14pt' }}>
                                    Nouveau Dossier
                                </h2>
                                <button
                                    onClick={() => setShowNewFolderModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateFolder} className="p-6">
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label form-label-required">
                                        Nom du dossier
                                    </label>
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="input-modern"
                                        placeholder="Documents RH"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Dossier parent
                                    </label>
                                    <select
                                        value={newFolderParent || ''}
                                        onChange={(e) => setNewFolderParent(e.target.value ? parseInt(e.target.value) : null)}
                                        className="input-modern"
                                    >
                                        <option value="">Racine</option>
                                        {folders.map(folder => (
                                            <option key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowNewFolderModal(false)}
                                    className="btn-secondary-professional flex-1"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary-professional flex-1"
                                >
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Partage */}
            {showShareModal && selectedDocument && (
                <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
                    <div className="modal-professional w-full max-w-md">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-slate-900" style={{ fontSize: '14pt' }}>
                                    Partager le Document
                                </h2>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-600 mb-4" style={{ fontSize: '12pt' }}>
                                Sélectionnez les utilisateurs avec qui partager ce document
                            </p>

                            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded">
                                {availableUsers.map(u => (
                                    <label
                                        key={u.id}
                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(u.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedUsers([...selectedUsers, u.id]);
                                                } else {
                                                    setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900" style={{ fontSize: '12pt' }}>
                                                {u.full_name}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                {u.department} - {u.position}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="btn-secondary-professional flex-1"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleShare}
                                    disabled={selectedUsers.length === 0}
                                    className="btn-primary-professional flex-1"
                                >
                                    Partager ({selectedUsers.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}