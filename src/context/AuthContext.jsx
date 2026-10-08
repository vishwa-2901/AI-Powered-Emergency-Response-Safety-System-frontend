import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ers_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ers_token');
    if (!token) { setLoading(false); return; }
    api.get('/users/me').then(({ data }) => {
      setUser(data);
      localStorage.setItem('ers_user', JSON.stringify(data));
    }).catch(() => logout()).finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ers_token', data.token);
    localStorage.setItem('ers_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    return api.post('/auth/register', payload);
  }

  function logout() {
    localStorage.removeItem('ers_token');
    localStorage.removeItem('ers_user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
