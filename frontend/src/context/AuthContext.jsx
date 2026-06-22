import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { setAccessToken } from '../api/client';

const AuthContext = createContext(null);

const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth (silent refresh on load)
  const initializeAuth = async () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.post('/auth/refresh');
      if (res.data.success && res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(JSON.parse(savedUser));
      } else {
        logoutUserLocal();
      }
    } catch (err) {
      // If it's a network/offline error, do NOT force log out. Load cached session if it exists
      const isNetworkError = !err.response;
      if (isNetworkError) {
        setUser(JSON.parse(savedUser));
      } else {
        logoutUserLocal();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    // Listen for auth-expired event from API client
    const handleAuthExpired = () => {
      logoutUserLocal();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user, accessToken } = res.data;
        setAccessToken(accessToken);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        // Cache credentials for offline login
        try {
          const passHash = await hashPassword(password);
          localStorage.setItem('offline_credentials', JSON.stringify({
            email: email.toLowerCase(),
            hash: passHash,
            user: user
          }));
        } catch (cacheErr) {
          console.error('Failed to cache credentials for offline use:', cacheErr);
        }

        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error) {
      // Offline fallback login validation
      if (!error.response) {
        try {
          const offlineCredsRaw = localStorage.getItem('offline_credentials');
          if (offlineCredsRaw) {
            const offlineCreds = JSON.parse(offlineCredsRaw);
            if (offlineCreds.email === email.toLowerCase()) {
              const passHash = await hashPassword(password);
              if (offlineCreds.hash === passHash) {
                // Successfully authenticated offline!
                setAccessToken('offline_mock_token');
                setUser(offlineCreds.user);
                localStorage.setItem('user', JSON.stringify(offlineCreds.user));
                return { success: true, offline: true };
              }
            }
          }
        } catch (offlineErr) {
          console.error('Failed during offline authentication:', offlineErr);
        }

        return {
          success: false,
          message: 'Network connection failed. Offline login credentials did not match or do not exist.'
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const { user, accessToken } = res.data;
        setAccessToken(accessToken);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        // Cache credentials for offline login
        try {
          const passHash = await hashPassword(userData.password);
          localStorage.setItem('offline_credentials', JSON.stringify({
            email: userData.email.toLowerCase(),
            hash: passHash,
            user: user
          }));
        } catch (cacheErr) {
          console.error('Failed to cache credentials for offline use:', cacheErr);
        }

        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      logoutUserLocal();
    }
  };

  const logoutUserLocal = () => {
    setAccessToken('');
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/update-profile', profileData);
      if (res.data.success && res.data.user) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Also update offline credentials user info if they exist
        try {
          const offlineCredsRaw = localStorage.getItem('offline_credentials');
          if (offlineCredsRaw) {
            const offlineCreds = JSON.parse(offlineCredsRaw);
            offlineCreds.user = updatedUser;
            localStorage.setItem('offline_credentials', JSON.stringify(offlineCreds));
          }
        } catch (offlineErr) {
          console.error('Failed to update offline credentials cache:', offlineErr);
        }

        return { success: true };
      }
      return { success: false, message: res.data.message || 'Update failed' };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'You must be online to update your profile.' };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
