import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

// ── Intercepteur token ────────────────────────────────────────────────────────
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => axios.post(`${API_URL}/login`, { email, password }),
  register: (data) => axios.post(`${API_URL}/register`, data),
  me: () => axios.get(`${API_URL}/me`),
};

// ── INVITATIONS EMPLOYÉS ──────────────────────────────────────────────────────
export const invitationsAPI = {
  // Envoyer une invitation (admin)
  invite: (data) =>
    axios.post(`${API_URL}/invite`, data),
  // data = { email, role, department, position }

  // Récupérer les infos d'une invitation (public — pas de token auth)
  getInvitation: (token) =>
    axios.get(`${API_URL}/invite/${token}`),

  // Inscription via invitation
  registerEmployee: (data) =>
    axios.post(`${API_URL}/register-employee`, data),
  // data = { invite_token, full_name, phone, position, department, password }

  // Liste des invitations en attente (admin)
  getAll: () =>
    axios.get(`${API_URL}/invitations`),

  // Annuler une invitation (admin)
  cancel: (token) =>
    axios.delete(`${API_URL}/invitations/${token}`),
};

// ── POSTS ─────────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: () => axios.get(`${API_URL}/posts`),
  create: (data) => axios.post(`${API_URL}/posts`, data),
  like: (id) => axios.post(`${API_URL}/posts/${id}/like`),
};

// ── TASKS ─────────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: () => axios.get(`${API_URL}/tasks`),
  create: (data) => axios.post(`${API_URL}/tasks`, data),
  update: (id, data) => axios.put(`${API_URL}/tasks/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/tasks/${id}`),
};

// ── LEAVES ────────────────────────────────────────────────────────────────────
export const leavesAPI = {
  getAll: () => axios.get(`${API_URL}/leaves`),
  create: (data) => axios.post(`${API_URL}/leaves`, data),
  review: (id, status) => axios.put(`${API_URL}/leaves/${id}/review`, { status }),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => axios.get(`${API_URL}/notifications`),
  markAsRead: (id) => axios.put(`${API_URL}/notifications/${id}/read`),
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => axios.get(`${API_URL}/dashboard/stats`),
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getSentiment: () => axios.get(`${API_URL}/analytics/sentiment`),
  getCommunication: () => axios.get(`${API_URL}/analytics/communication`),
  getPerformance: () => axios.get(`${API_URL}/analytics/performance`),
};

// ── MESSAGES ──────────────────────────────────────────────────────────────────
export const messagesAPI = {
  getAll: () => axios.get(`${API_URL}/messages`),
  send: (data) => axios.post(`${API_URL}/messages`, data),
  getConversations: () => axios.get(`${API_URL}/messages/conversations`),
  getOrCreateConversation: (uid) => axios.get(`${API_URL}/messages/conversation/${uid}`),
  getMessages: (convId) => axios.get(`${API_URL}/messages/${convId}`),
  sendMessage: (data) => axios.post(`${API_URL}/messages/send`, data),
  markAsRead: (id) => axios.put(`${API_URL}/messages/${id}/read`),
  getGroups: () => axios.get(`${API_URL}/messages/groups`),
  searchUsers: (q) => axios.get(`${API_URL}/users/search`, { params: { q } }),
};

// ── SURVEYS ───────────────────────────────────────────────────────────────────
export const surveysAPI = {
  getAll: () => axios.get(`${API_URL}/surveys`),
  getDetail: (id) => axios.get(`${API_URL}/surveys/${id}`),
  create: (data) => axios.post(`${API_URL}/surveys`, data),
  respond: (id, answers) => axios.post(`${API_URL}/surveys/${id}/respond`, { answers }),
  getResults: (id) => axios.get(`${API_URL}/surveys/${id}/results`),
  delete: (id) => axios.delete(`${API_URL}/surveys/${id}`),
};

// ── FEEDBACKS ─────────────────────────────────────────────────────────────────
export const feedbacksAPI = {
  getAll: () => axios.get(`${API_URL}/feedbacks`),
  create: (data) => axios.post(`${API_URL}/feedbacks`, data),
  respond: (id, data) => axios.post(`${API_URL}/feedbacks/${id}/respond`, data),
  getStats: () => axios.get(`${API_URL}/feedbacks/stats`),
};

// ── ARCHIVES ──────────────────────────────────────────────────────────────────
export const archivesAPI = {
  getFolders: () => axios.get(`${API_URL}/archives/folders`),
  createFolder: (data) => axios.post(`${API_URL}/archives/folders`, data),
  getDocuments: (params = {}) => axios.get(`${API_URL}/archives/documents`, { params }),
  uploadDocument: (formData) => axios.post(`${API_URL}/archives/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocumentDetail: (id) => axios.get(`${API_URL}/archives/documents/${id}`),
  updateDocument: (id, data) => axios.put(`${API_URL}/archives/documents/${id}`, data),
  deleteDocument: (id) => axios.delete(`${API_URL}/archives/documents/${id}`),
  downloadDocument: (id) => axios.get(`${API_URL}/archives/documents/${id}/download`, {
    responseType: 'blob'
  }),
  shareDocument: (id, uids) => axios.post(`${API_URL}/archives/documents/${id}/share`, { user_ids: uids }),
  getStats: () => axios.get(`${API_URL}/archives/stats`),
};

// ── USERS ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => axios.get(`${API_URL}/users`),
  getOne: (id) => axios.get(`${API_URL}/users/${id}`),
  update: (id, data) => axios.put(`${API_URL}/users/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`),
};

// ── UPLOAD ────────────────────────────────────────────────────────────────────
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// ── CHEF DE DÉPARTEMENT ───────────────────────────────────────────────────────
export const chefAPI = {
  getEvaluations: () => axios.get(`${API_URL}/evaluations`),
  createEvaluation: (data) => axios.post(`${API_URL}/evaluations`, data),
  updateEvaluation: (id, data) => axios.put(`${API_URL}/evaluations/${id}`, data),
  deleteEvaluation: (id) => axios.delete(`${API_URL}/evaluations/${id}`),

  getPrimes: () => axios.get(`${API_URL}/primes`),
  createPrime: (data) => axios.post(`${API_URL}/primes`, data),
  updatePrime: (id, data) => axios.put(`${API_URL}/primes/${id}`, data),
  deletePrime: (id) => axios.delete(`${API_URL}/primes/${id}`),

  getRecrutement: () => axios.get(`${API_URL}/recrutement`),
  createPoste: (data) => axios.post(`${API_URL}/recrutement`, data),
  updatePoste: (id, data) => axios.put(`${API_URL}/recrutement/${id}`, data),
  deletePoste: (id) => axios.delete(`${API_URL}/recrutement/${id}`),
  getCandidats: (posteId) => axios.get(`${API_URL}/recrutement/${posteId}/candidats`),
  addCandidat: (posteId, data) => axios.post(`${API_URL}/recrutement/${posteId}/candidats`, data),
  updateCandidat: (id, data) => axios.put(`${API_URL}/recrutement/candidats/${id}`, data),
  deleteCandidat: (id) => axios.delete(`${API_URL}/recrutement/candidats/${id}`),
};

// ── AUTH AVANCÉE ──────────────────────────────────────────────────────────────
export const authAdvancedAPI = {
  registerRequest: (data) => axios.post(`${API_URL}/auth/register-request`, data),
  verifyCode: (email, code, password) => axios.post(`${API_URL}/auth/verify-code`, { email, code, password }),
  resendCode: (email) => axios.post(`${API_URL}/auth/resend-code`, { email }),
  forgotPassword: (email) => axios.post(`${API_URL}/forgot-password`, { email }),
  resetPassword: (email, code, new_password) => axios.post(`${API_URL}/reset-password`, { email, code, new_password }),
  verifyOtp: (email, code) => axios.post(`${API_URL}/verify-otp`, { email, code }),
  changePassword: (current_password, new_password) => axios.post(`${API_URL}/auth/change-password`, { current_password, new_password }),
  getLoginHistory: () => axios.get(`${API_URL}/auth/login-history`),
};

export default {
  auth: authAPI,
  authAdvanced: authAdvancedAPI,
  invitations: invitationsAPI,
  posts: postsAPI,
  tasks: tasksAPI,
  leaves: leavesAPI,
  notifications: notificationsAPI,
  dashboard: dashboardAPI,
  analytics: analyticsAPI,
  messages: messagesAPI,
  surveys: surveysAPI,
  feedbacks: feedbacksAPI,
  archives: archivesAPI,
  users: usersAPI,
  upload: uploadAPI,
  chef: chefAPI,
};