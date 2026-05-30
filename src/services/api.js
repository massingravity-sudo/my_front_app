import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

// ── Intercepteur token ────────────────────────────────────────────────────────
// FIX: vérifie les deux clés possibles (authToken ET token)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
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
  forgotPassword: (email) => axios.post(`${API_URL}/forgot-password`, { email }),
  verifyOtp: (email, code) => axios.post(`${API_URL}/verify-otp`, { email, code }),
  resetPassword: (email, code, new_password) => axios.post(`${API_URL}/reset-password`, { email, code, new_password }),
  changePassword: (current_password, new_password) => axios.post(`${API_URL}/users/change-password`, { current_password, new_password }),
};

// ── AUTH AVANCÉE (compatibilité) ──────────────────────────────────────────────
export const authAdvancedAPI = {
  forgotPassword: (email) => axios.post(`${API_URL}/forgot-password`, { email }),
  verifyOtp: (email, code) => axios.post(`${API_URL}/verify-otp`, { email, code }),
  resetPassword: (email, code, new_password) => axios.post(`${API_URL}/reset-password`, { email, code, new_password }),
  changePassword: (current_password, new_password) => axios.post(`${API_URL}/users/change-password`, { current_password, new_password }),
  // Ces routes n'existent pas dans le backend — elles retourneront 404
  // mais au moins ça ne crashe plus au démarrage
  registerRequest: (data) => axios.post(`${API_URL}/auth/register-request`, data),
  verifyCode: (email, code, password) => axios.post(`${API_URL}/auth/verify-code`, { email, code, password }),
  resendCode: (email) => axios.post(`${API_URL}/auth/resend-code`, { email }),
  getLoginHistory: () => axios.get(`${API_URL}/auth/login-history`),
};

// ── INVITATIONS EMPLOYÉS ──────────────────────────────────────────────────────
export const invitationsAPI = {
  invite: (data) => axios.post(`${API_URL}/invite`, data),
  inviteBulk: (employees) => axios.post(`${API_URL}/invite/bulk`, { employees }),
  getAll: () => axios.get(`${API_URL}/invitations`),
  resend: (id) => axios.post(`${API_URL}/invitations/${id}/resend`),
  cancel: (id) => axios.delete(`${API_URL}/invitations/${id}`),
};

// ── POSTS ─────────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: () => axios.get(`${API_URL}/posts`),
  create: (data) => axios.post(`${API_URL}/posts`, data),
  like: (id) => axios.post(`${API_URL}/posts/${id}/like`),
  comment: (id, content) => axios.post(`${API_URL}/posts/${id}/comment`, { content }),
};

// ── TASKS ─────────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: () => axios.get(`${API_URL}/tasks`),
  create: (data) => axios.post(`${API_URL}/tasks`, data),
  update: (id, data) => axios.put(`${API_URL}/tasks/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/tasks/${id}`),
  addComment: (id, content) => axios.post(`${API_URL}/tasks/${id}/comment`, { content }),
};

// ── LEAVES ────────────────────────────────────────────────────────────────────
export const leavesAPI = {
  getAll: () => axios.get(`${API_URL}/leaves`),
  create: (data) => axios.post(`${API_URL}/leaves`, data),
  review: (id, status, comment) => axios.put(`${API_URL}/leaves/${id}/review`, { status, comment }),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => axios.get(`${API_URL}/notifications`),
  markAsRead: (id) => axios.put(`${API_URL}/notifications/${id}/read`),
  markAllRead: () => axios.put(`${API_URL}/notifications/read-all`),
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => axios.get(`${API_URL}/dashboard/stats`),
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getOverview: () => axios.get(`${API_URL}/analytics/overview`),
  getSentiment: () => axios.get(`${API_URL}/analytics/sentiment`),
};

// ── MESSAGES & CONVERSATIONS ──────────────────────────────────────────────────
export const messagesAPI = {
  // Conversations
  // FIX: getConversations pointait sur /messages/conversations (404) → corrigé vers /conversations
  getConversations: () => axios.get(`${API_URL}/conversations`),
  createConversation: (userId) => axios.post(`${API_URL}/conversations`, { user_id: userId }),

  // Messages d'une conversation
  getMessages: (convId) => axios.get(`${API_URL}/conversations/${convId}/messages`),
  sendMessage: (convId, content) => axios.post(`${API_URL}/conversations/${convId}/messages`, { content }),

  // Legacy (compatibilité ancienne API)
  getAll: () => axios.get(`${API_URL}/messages`),
  send: (data) => axios.post(`${API_URL}/messages`, data),

  // Recherche utilisateurs
  searchUsers: (q) => axios.get(`${API_URL}/users`, { params: { q } }),
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
  vote: (id) => axios.post(`${API_URL}/feedbacks/${id}/vote`),
  // FIX: /feedbacks/stats n'existe pas dans le backend → on calcule côté frontend
  // ou on utilise /analytics/overview qui contient les données nécessaires
  getStats: () => axios.get(`${API_URL}/analytics/overview`),
};

// ── UPLOAD ────────────────────────────────────────────────────────────────────
export const uploadAPI = {
  // FIX: ajout de uploadFile qui manquait (causait "uploadFile is not a function")
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── ARCHIVES ──────────────────────────────────────────────────────────────────
export const archivesAPI = {
  getFolders: () => axios.get(`${API_URL}/archives/folders`),
  createFolder: (data) => axios.post(`${API_URL}/archives/folders`, data),
  getDocuments: (params = {}) => axios.get(`${API_URL}/archives/documents`, { params }),
  uploadDocument: (formData) => axios.post(`${API_URL}/archives/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDocumentDetail: (id) => axios.get(`${API_URL}/archives/documents/${id}`),
  updateDocument: (id, data) => axios.put(`${API_URL}/archives/documents/${id}`, data),
  deleteDocument: (id) => axios.delete(`${API_URL}/archives/documents/${id}`),
  downloadDocument: (id) => axios.get(`${API_URL}/archives/documents/${id}/download`, {
    responseType: 'blob',
  }),
  shareDocument: (id, uids) => axios.post(`${API_URL}/archives/documents/${id}/share`, { user_ids: uids }),
  getStats: () => axios.get(`${API_URL}/archives/stats`),
};

// ── USERS ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => axios.get(`${API_URL}/users`, { params }),
  getOne: (id) => axios.get(`${API_URL}/users/${id}`),
  update: (id, data) => axios.put(`${API_URL}/users/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`),
  updateDepartment: (id, department) => axios.put(`${API_URL}/users/${id}/department`, { department }),
  getByDepartment: () => axios.get(`${API_URL}/users/by-department`),
};

// ── ORGANISATION ──────────────────────────────────────────────────────────────
export const organizationAPI = {
  get: () => axios.get(`${API_URL}/organization`),
  getSettings: () => axios.get(`${API_URL}/organization/settings`),
  updateSettings: (data) => axios.put(`${API_URL}/organization/settings`, data),
  getDepartments: () => axios.get(`${API_URL}/organization/departments`),
  getDepartmentManager: (dept) => axios.get(`${API_URL}/departments/${dept}/manager`),
  assignManager: (dept, employeeId) => axios.post(`${API_URL}/departments/${dept}/manager`, { employee_id: employeeId }),
  removeManager: (dept) => axios.delete(`${API_URL}/departments/${dept}/manager`),
};

// ── RH ────────────────────────────────────────────────────────────────────────
export const hrAPI = {
  // Évaluations
  getEvaluations: () => axios.get(`${API_URL}/hr/evaluations`),
  createEvaluation: (data) => axios.post(`${API_URL}/hr/evaluations`, data),
  updateEvaluation: (id, data) => axios.put(`${API_URL}/hr/evaluations/${id}`, data),
  deleteEvaluation: (id) => axios.delete(`${API_URL}/hr/evaluations/${id}`),
  approveEvaluation: (id, action, reason) => axios.post(`${API_URL}/hr/evaluations/${id}/approve`, { action, reason }),

  // Primes
  getBonuses: () => axios.get(`${API_URL}/hr/bonuses`),
  createBonus: (data) => axios.post(`${API_URL}/hr/bonuses`, data),
  approveBonus: (id, action, reason) => axios.post(`${API_URL}/hr/bonuses/${id}/approve`, { action, reason }),

  // Absences
  getAbsences: () => axios.get(`${API_URL}/hr/absences`),
  createAbsence: (data) => axios.post(`${API_URL}/hr/absences`, data),

  // Formations
  getTrainings: () => axios.get(`${API_URL}/hr/trainings`),
  createTraining: (data) => axios.post(`${API_URL}/hr/trainings`, data),
  enrollTraining: (id, employeeId) => axios.post(`${API_URL}/hr/trainings/${id}/enroll`, { employee_id: employeeId }),

  // Rapports
  getDepartmentReport: (dept) => axios.get(`${API_URL}/hr/reports/department/${dept}`),
  getEmployeeReport: (id) => axios.get(`${API_URL}/hr/reports/employee/${id}`),
};

// ── ML ANALYTICS ──────────────────────────────────────────────────────────────
// FIX: toutes les routes ML pointaient sur localhost:5000 → corrigé vers API_URL
export const mlAPI = {
  initialize: () => axios.post(`${API_URL}/ml/initialize`),
  getModelsStatus: () => axios.get(`${API_URL}/ml/models/status`),
  getSentimentAnalysis: () => axios.get(`${API_URL}/ml/sentiment/batch-analysis`),
  getTurnoverPredictions: () => axios.get(`${API_URL}/ml/turnover/predictions`),
  getAnomalies: () => axios.get(`${API_URL}/ml/anomalies`),
  getProductivityForecast: () => axios.get(`${API_URL}/ml/forecast/productivity`),
  getCollaborationNetwork: () => axios.get(`${API_URL}/ml/collaboration/network`),
  getExecutiveDashboard: () => axios.get(`${API_URL}/ml/executive-dashboard`),
  getSurveysAnalysis: () => axios.get(`${API_URL}/ml/surveys`),
  // FIX: /ml/surveys/global-insights n'existe pas → redirige vers /ml/surveys
  getSurveysInsights: () => axios.get(`${API_URL}/ml/surveys`),
};

// ── EXPORT PAR DÉFAUT ─────────────────────────────────────────────────────────
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
  organization: organizationAPI,
  hr: hrAPI,
  ml: mlAPI,
  upload: uploadAPI,
};