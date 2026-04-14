import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('currentUser');
        }
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUserState(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userMode'); // ← nettoyage du mode aussi
    delete axios.defaults.headers.common['Authorization'];
  };

  const setUser = (newUserData) => {
    const merged = { ...(user || {}), ...newUserData };
    setUserState(merged);
    localStorage.setItem('currentUser', JSON.stringify(merged));
  };

  // ── Dérivés du rôle ──────────────────────────────────────
  const isAdmin = user?.role === 'admin';
  const isChefDept = user?.role === 'chef_departement';

  return (
    <AuthContext.Provider value={{
      user, token, login, logout, loading, setUser,
      isAdmin,      // ← exposé ici
      isChefDept,   // ← exposé ici
    }}>
      {children}
    </AuthContext.Provider>
  );
};