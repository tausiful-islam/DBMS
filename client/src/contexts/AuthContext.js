import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        // Set authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token is still valid
        const response = await api.get('/auth/me');
        
        if (response.data && response.data.user) {
          dispatch({ type: 'SET_USER', payload: response.data.user });
        } else {
          // Invalid response, clear auth
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Token is invalid or expired
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
        toast.error('Session expired. Please login again.');
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/auth/login', { email, password });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/auth/register', { name, email, password, role });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      dispatch({ type: 'SET_USER', payload: response.data.user });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
