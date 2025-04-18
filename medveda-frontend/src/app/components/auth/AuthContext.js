'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, storeToken, removeToken } from '@/app/utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null: unknown, false: anonymous, user: authenticated

  useEffect(() => {
    const token = getToken();
    if (token) {
      // You can verify token with /users/me/ later
      setUser({ username: 'authenticated_user' }); // Temp
    } else {
      setUser(false); // Anonymous
    }
  }, []);

  const login = (userData, token) => {
    storeToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
