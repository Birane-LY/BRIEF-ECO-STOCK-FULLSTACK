import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constant";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => localStorage.getItem("USER_NAME") || null);
  const [isAuthorized, setIsAuthorized] = useState(() => !!localStorage.getItem(ACCESS_TOKEN));

  const login = useCallback((username, tokens) => {
    const cleanUser = username.includes("@") ? username.split("@")[0] : username;
    
    localStorage.setItem("USER_NAME", cleanUser);
    if (tokens?.access) localStorage.setItem(ACCESS_TOKEN, tokens.access);
    if (tokens?.refresh) localStorage.setItem(REFRESH_TOKEN, tokens.refresh);

    setUser(cleanUser);
    setIsAuthorized(true);
    navigate("/", { replace: true });
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("USER_NAME");
    
    setUser(null);
    setIsAuthorized(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};