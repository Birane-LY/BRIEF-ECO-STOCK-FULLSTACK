import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Initialize the Authentication Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged in user metadata
  const navigate = useNavigate();

  // Handles mock authentication state changes
  const login = (email) => {
    // Extract username prefix from professional email for profile display
    const username = email.split("@")[0];
    
    setUser({
      name: username,
      role: "Admin",
      avatar: username.charAt(0).toUpperCase()
    });
    
    navigate("/"); // Redirect to Overview page upon successful login
  };

  // Clears user session states and redirects to public login screen
  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom fallback hook for easy context usage across components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};