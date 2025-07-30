import React, { createContext, useState, useEffect } from "react";
import { loginAPI, registerAPI, getMeAPI } from "./api";

export const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * AuthProvider manages authentication and user session.
   * Holds token/user in state; persists across reload via localStorage.
   */
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      // Try to fetch user info on load
      getMeAPI(token).then(u => {
        if (u) setUser(u);
        else setToken(null);
      }).catch(() => setToken(null));
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    setLoading(true); setError(null);
    try {
      const { token: t, user: u, error: err } = await loginAPI(username, password);
      if (err) setError(err);
      else if (t && u) {
        setToken(t);
        localStorage.setItem("token", t);
        setUser(u);
      }
    } catch (e) {
      setError("Login failed.");
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const register = async (username, password) => {
    setLoading(true); setError(null);
    try {
      const { token: t, user: u, error: err } = await registerAPI(username, password);
      if (err) setError(err);
      else if (t && u) {
        setToken(t);
        localStorage.setItem("token", t);
        setUser(u);
      }
    } catch (e) {
      setError("Registration failed.");
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
