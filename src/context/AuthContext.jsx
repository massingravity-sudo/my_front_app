import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────
// CONFIG — une seule source de vérité pour l'URL
// ─────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://web-production-6fe43.up.railway.app';
const API_URL = `${BASE_URL}/api`;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {

  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // ── Rehydrate session au démarrage ──────────
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }

    setLoading(false);
  }, []);

  // ─────────────────────────────────────────────
  // AUTH FUNCTIONS
  // ─────────────────────────────────────────────

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token: newToken, user: newUser } = response.data;

      _saveSession(newToken, newUser);
      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Email ou mot de passe incorrect',
      };
    }
  };

  // 🆕 REGISTER
  const register = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      const { token: newToken, user: newUser } = response.data;

      _saveSession(newToken, newUser);
      return { success: true };

    } catch (error) {
      const msg =
        error.response?.data?.error ||
        "Erreur lors de l'inscription. Vérifiez vos informations.";
      return { success: false, error: msg };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userMode');
    delete axios.defaults.headers.common['Authorization'];
  };

  // 🔄 UPDATE USER (mise à jour partielle)
  const setUser = (newData) => {
    const updated = { ...(user || {}), ...newData };
    setUserState(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  // ─────────────────────────────────────────────
  // HELPERS PRIVÉS
  // ─────────────────────────────────────────────
  const _saveSession = (newToken, newUser) => {
    setToken(newToken);
    setUserState(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // ─────────────────────────────────────────────
  // ROLES
  // ─────────────────────────────────────────────
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  // ─────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────
  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, setUser,
      isAdmin, isManager, isEmployee,
    }}>
      {children}
    </AuthContext.Provider>
  );
};