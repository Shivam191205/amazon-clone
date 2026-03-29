'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('amazon_clone_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      // We'll need to update apiFetch to include the token in headers
      const res = await api.getMe();
      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      // We only clear the token if we know it's a hard auth failure, 
      // preventing auto-logouts during server restarts.
      if (err.message && err.message.includes('Not authorized')) {
        localStorage.removeItem('amazon_clone_token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      localStorage.setItem('amazon_clone_token', res.data.token);
      setUser(res.data.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const signup = async (userData) => {
    const res = await api.signup(userData);
    if (res.success) {
      localStorage.setItem('amazon_clone_token', res.data.token);
      setUser(res.data.user);
      return res;
    }
    throw new Error(res.message || 'Signup failed');
  };

  const logout = () => {
    localStorage.removeItem('amazon_clone_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
