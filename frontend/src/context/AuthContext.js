// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const clearError = () => setError(null);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user',  JSON.stringify(data.data.user));
      setUser(data.data.user);
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { ok: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user',  JSON.stringify(data.data.user));
      setUser(data.data.user);
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg  || 'Registration failed';
      setError(msg);
      return { ok: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, error, isAdmin, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
