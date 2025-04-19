'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, storeToken, removeToken } from '@/app/utils/auth';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const parseToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.username || null,
      email: decoded.email || null,
      isAdmin: decoded.is_admin || false,
    };
  } catch (err) {
    return { username: null, email: null, isAdmin: false };
  }
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshAuth = () => {
    const token = getToken();
    if (token) {
      const { username, email, isAdmin } = parseToken(token);
      setUser({ username, email });  // ✅ Now user is an object
      setIsAdmin(isAdmin);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshAuth(); // on mount
    }
  }, []); // empty array = only runs once on mount

  const login = (userData, token) => {
    storeToken(token);
    setUser({ username: userData.username, email: userData.email });
    setIsAdmin(userData.isAdmin || false);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
