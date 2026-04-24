import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://massibns10.pythonanywhere.com';
const API_URL = `${BASE_URL}/api`;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [organization, setOrgState] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // ── Rehydrate session au démarrage ────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    const storedOrg = localStorage.getItem('currentOrg');

    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }
    if (storedUser) {
      try { setUserState(JSON.parse(storedUser)); } catch { localStorage.removeItem('currentUser'); }
    }
    if (storedOrg) {
      try { setOrgState(JSON.parse(storedOrg)); } catch { localStorage.removeItem('currentOrg'); }
    }
    setLoading(false);
  }, []);

  // ── Helper interne ────────────────────────────────────────────────────────
  const _saveSession = (newToken, newUser, newOrg = null) => {
    setToken(newToken);
    setUserState(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    if (newOrg) {
      setOrgState(newOrg);
      localStorage.setItem('currentOrg', JSON.stringify(newOrg));
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token: newToken, user: newUser } = res.data;

      // Récupérer l'organisation après login
      _saveSession(newToken, newUser);

      try {
        const meRes = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        if (meRes.data.organization) {
          setOrgState(meRes.data.organization);
          localStorage.setItem('currentOrg', JSON.stringify(meRes.data.organization));
        }
      } catch (_) { }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Email ou mot de passe incorrect',
      };
    }
  };

  // ── REGISTER ADMIN ────────────────────────────────────────────────────────
  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      const { token: newToken, user: newUser, organization: newOrg } = res.data;

      _saveSession(newToken, newUser, newOrg);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Erreur lors de l'inscription.",
      };
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    setToken(null);
    setUserState(null);
    setOrgState(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentOrg');
    localStorage.removeItem('userMode');
    delete axios.defaults.headers.common['Authorization'];
  };

  // ── UPDATE USER ───────────────────────────────────────────────────────────
  const setUser = (newData) => {
    const updated = { ...(user || {}), ...newData };
    setUserState(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  // ── UPDATE ORG ────────────────────────────────────────────────────────────
  const setOrganization = (newData) => {
    const updated = { ...(organization || {}), ...newData };
    setOrgState(updated);
    localStorage.setItem('currentOrg', JSON.stringify(updated));
  };

  // ── ROLES ─────────────────────────────────────────────────────────────────
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';
  // Compatibilité avec l'ancien code qui utilise isChefDept
  const isChefDept = user?.role === 'chef_departement' || user?.role === 'manager';

  // ── Nom de l'entreprise (raccourci pratique) ──────────────────────────────
  const orgName = organization?.name || user?.organization_name || 'CommSight';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      organization, orgName,
      login, register, logout,
      setUser, setOrganization,
      isAdmin, isManager, isEmployee, isChefDept,
    }}>
      {children}
    </AuthContext.Provider>
  );
};