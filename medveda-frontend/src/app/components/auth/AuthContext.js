'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, storeToken, removeToken } from '@/app/utils/auth';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const parseToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      user: decoded.username || null,
      isAdmin: decoded.is_admin || false,
    };
  } catch (err) {
    return { user: null, isAdmin: false };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // user object or null
  const [isAdmin, setIsAdmin] = useState(false); // separate admin flag

  useEffect(() => {
    const token = getToken();
    if (token) {
      const { user, isAdmin } = parseToken(token);
      setUser(user);
      setIsAdmin(isAdmin);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  const login = (userData, token) => {
    storeToken(token);
    const parsed = parseToken(token);
    setUser(parsed.user);
    setIsAdmin(parsed.isAdmin);
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
