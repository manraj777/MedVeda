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
  const [loaded, setLoaded] = useState(false);

  const refreshAuth = () => {
    const token = getToken();
    if (token) {
      const { username, email, isAdmin } = parseToken(token);
      setUser({ username, email });
      setIsAdmin(isAdmin);  // ✅ This matters
      
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoaded(true);
  };

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshAuth(); // on mount
    }
  }, []); // empty array = only runs once on mount

  const login = (decodedUser, token) => {
    storeToken(token);
    setUser({ username: decodedUser.username, email: decodedUser.email || null });
    setIsAdmin(decodedUser.is_admin === true);
  };
  
  

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout , loaded}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
