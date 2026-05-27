import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status/');
      if (response.ok) {
        const data = await response.json();
        if (data.is_authenticated) {
          setUser({ username: data.username, email: data.email });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser({ username: data.username });
        setIsAuthenticated(true);
        // Refresh auth status to get email
        await checkAuthStatus();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch('/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser({ username: data.username });
        setIsAuthenticated(true);
        await checkAuthStatus();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup.' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout/', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        setIsAuthenticated(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    return { success: false };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
