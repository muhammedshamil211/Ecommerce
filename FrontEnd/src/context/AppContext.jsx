import React, { createContext, useEffect, useState } from 'react'
import {refreshToken} from '../services/api'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Try refreshing access token
        const res = await refreshToken();

        if (res.success) {
          const updatedUser = {
            ...storedUser,
            accessToken: res.accessToken
          };

          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AppContext.Provider value={{ user, setUser, loading, setLoading,logout }}>
      {children}
    </AppContext.Provider>
  )
}
