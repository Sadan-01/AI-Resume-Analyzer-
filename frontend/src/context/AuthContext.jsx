import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile of logged-in user on initialization
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { access_token } = response.data.data;
        localStorage.setItem('token', access_token);
        // Load the actual user profile info after setting token
        const profileRes = await api.get('/auth/me');
        if (profileRes.data && profileRes.data.success) {
          setUser(profileRes.data.data);
        }
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || 'Login failed.' };
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || 'Invalid credentials or connection error.';
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password,
      });
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || 'Registration failed.' };
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.response?.data?.message || 'Registration failed. Check details or email.';
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
