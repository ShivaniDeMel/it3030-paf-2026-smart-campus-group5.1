<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();
=======
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Validate token
          await authAPI.validateToken(token);
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    checkAuth();
=======
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
  }, []);

  const login = async (credentials) => {
    try {
<<<<<<< HEAD
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
=======
      // Simulated login - replace with actual API call
      const mockUser = {
        id: '1',
        firstName: credentials.email.split('@')[0],
        lastName: 'Student',
        email: credentials.email,
        role: 'student',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid email or password' };
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
    }
  };

  const logout = () => {
<<<<<<< HEAD
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
=======
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
      {children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD
=======

export default AuthContext;
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
