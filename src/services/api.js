import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';

const API_URL = `${BASE_URL}/api`;


// Intercepteur pour ajouter le token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  login: (email, password) =>
    axios.post(`${API_URL}/login`, { email, password }),

  register: (data) =>
    axios.post(`${API_URL}/register`, data),

  me: () =>
    axios.get(`${API_URL}/me`),
};

// AUTH AVANCÉE
export const authAdvancedAPI = {
  registerRequest: (data) =>
    axios.post(`${API_URL}/auth/register-request`, data),

  verifyCode: (email, code, password) =>
    axios.post(`${API_URL}/auth/verify-code`, { email, code, password }),

  resendCode: (email) =>
    axios.post(`${API_URL}/auth/resend-code`, { email }),

  forgotPassword: (email) =>
    axios.post(`${API_URL}/auth/forgot-password`, { email }),

  resetPassword: (email, code, new_password) =>
    axios.post(`${API_URL}/auth/reset-password`, { email, code, new_password }),

  changePassword: (current_password, new_password) =>
    axios.post(`${API_URL}/auth/change-password`, { current_password, new_password }),

  getLoginHistory: () =>
    axios.get(`${API_URL}/auth/login-history`),
};

// POSTS
export const postsAPI = {
  getAll: () =>
    axios.get(`${API_URL}/posts`),

  create: (data) =>
    axios.post(`${API_URL}/posts`, data),

  like: (postId) =>
    axios.post(`${API_URL}/posts/${postId}/like`),
};

// TASKS
export const tasksAPI = {
  getAll: () =>
    axios.get(`${API_URL}/tasks`),

  create: (data) =>
    axios.post(`${API_URL}/tasks`, data),

  update: (taskId, data) =>
    axios.put(`${API_URL}/tasks/${taskId}`, data),

  delete: (taskId) =>
    axios.delete(`${API_URL}/tasks/${taskId}`),
};

// LEAVES
export const leavesAPI = {
  getAll: () =>
    axios.get(`${API_URL}/leaves`),

  create: (data) =>
    axios.post(`${API_URL}/leaves`, data),

  review: (leaveId, status) =>
    axios.put(`${API_URL}/leaves/${leaveId}/review`, { status }),
};

// NOTIFICATIONS
export const notificationsAPI = {
  getAll: () =>
    axios.get(`${API_URL}/notifications`),

  markAsRead: (notifId) =>
    axios.put(`${API_URL}/notifications/${notifId}/read`),
};

// DASHBOARD
export const dashboardAPI = {
  getStats: () =>
    axios.get(`${API_URL}/dashboard/stats`),
};

// ANALYTICS
export const analyticsAPI = {
  getSentiment: () =>
    axios.get(`${API_URL}/analytics/sentiment`),

  getCommunication: () =>
    axios.get(`${API_URL}/analytics/communication`),

  getPerformance: () =>
    axios.get(`${API_URL}/analytics/performance`),
};

// MESSAGES
export const messagesAPI = {
  getConversations: () =>
    axios.get(`${API_URL}/messages/conversations`),

  getOrCreateConversation: (userId) =>
    axios.get(`${API_URL}/messages/conversation/${userId}`),

  getMessages: (conversationId) =>
    axios.get(`${API_URL}/messages/${conversationId}`),

  sendMessage: (data) =>
    axios.post(`${API_URL}/messages/send`, data),

  markAsRead: (messageId) =>
    axios.put(`${API_URL}/messages/${messageId}/read`),

  getGroups: () =>
    axios.get(`${API_URL}/messages/groups`),

  searchUsers: (query) =>
    axios.get(`${API_URL}/users/search`, { params: { q: query } }),
};

// SURVEYS
export const surveysAPI = {
  getAll: () =>
    axios.get(`${API_URL}/surveys`),

  getDetail: (surveyId) =>
    axios.get(`${API_URL}/surveys/${surveyId}`),

  create: (data) =>
    axios.post(`${API_URL}/surveys`, data),

  respond: (surveyId, answers) =>
    axios.post(`${API_URL}/surveys/${surveyId}/respond`, { answers }),

  getResults: (surveyId) =>
    axios.get(`${API_URL}/surveys/${surveyId}/results`),

  delete: (surveyId) =>
    axios.delete(`${API_URL}/surveys/${surveyId}`),
};

// FEEDBACKS
export const feedbacksAPI = {
  getAll: () =>
    axios.get(`${API_URL}/feedbacks`),

  create: (data) =>
    axios.post(`${API_URL}/feedbacks`, data),

  respond: (feedbackId, data) =>
    axios.post(`${API_URL}/feedbacks/${feedbackId}/respond`, data),

  getStats: () =>
    axios.get(`${API_URL}/feedbacks/stats`),
};

// ARCHIVES
export const archivesAPI = {
  getFolders: () =>
    axios.get(`${API_URL}/archives/folders`),

  createFolder: (data) =>
    axios.post(`${API_URL}/archives/folders`, data),

  getDocuments: (params = {}) =>
    axios.get(`${API_URL}/archives/documents`, { params }),

  uploadDocument: (formData) =>
    axios.post(`${API_URL}/archives/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  getDocumentDetail: (docId) =>
    axios.get(`${API_URL}/archives/documents/${docId}`),

  updateDocument: (docId, data) =>
    axios.put(`${API_URL}/archives/documents/${docId}`, data),

  deleteDocument: (docId) =>
    axios.delete(`${API_URL}/archives/documents/${docId}`),

  downloadDocument: (docId) =>
    axios.get(`${API_URL}/archives/documents/${docId}/download`, {
      responseType: 'blob'
    }),

  shareDocument: (docId, userIds) =>
    axios.post(`${API_URL}/archives/documents/${docId}/share`, { user_ids: userIds }),

  getStats: () =>
    axios.get(`${API_URL}/archives/stats`),
};

// USERS
export const usersAPI = {
  getAll: () =>
    axios.get(`${API_URL}/users`),
};

// UPLOAD
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default {
  auth: authAPI,
  authAdvanced: authAdvancedAPI,
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
};

// CHEF DE DÉPARTEMENT
export const chefAPI = {
  getEvaluations: () =>
    axios.get(`${API_URL}/evaluations`),
  createEvaluation: (data) =>
    axios.post(`${API_URL}/evaluations`, data),
  updateEvaluation: (id, data) =>
    axios.put(`${API_URL}/evaluations/${id}`, data),
  deleteEvaluation: (id) =>
    axios.delete(`${API_URL}/evaluations/${id}`),

  getPrimes: () =>
    axios.get(`${API_URL}/primes`),
  createPrime: (data) =>
    axios.post(`${API_URL}/primes`, data),
  updatePrime: (id, data) =>
    axios.put(`${API_URL}/primes/${id}`, data),
  deletePrime: (id) =>
    axios.delete(`${API_URL}/primes/${id}`),

  getRecrutement: () =>
    axios.get(`${API_URL}/recrutement`),
  createPoste: (data) =>
    axios.post(`${API_URL}/recrutement`, data),
  updatePoste: (id, data) =>
    axios.put(`${API_URL}/recrutement/${id}`, data),
  deletePoste: (id) =>
    axios.delete(`${API_URL}/recrutement/${id}`),
  getCandidats: (posteId) =>
    axios.get(`${API_URL}/recrutement/${posteId}/candidats`),
  addCandidat: (posteId, data) =>
    axios.post(`${API_URL}/recrutement/${posteId}/candidats`, data),
  updateCandidat: (id, data) =>
    axios.put(`${API_URL}/recrutement/candidats/${id}`, data),
  deleteCandidat: (id) =>
    axios.delete(`${API_URL}/recrutement/candidats/${id}`),
};