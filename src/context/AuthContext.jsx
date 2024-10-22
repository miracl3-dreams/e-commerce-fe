import React, { createContext, useContext, useState } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  // Login function to authenticate users
  const login = async (formData) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      setUser(data.user);
      setAuthToken(data.token);
      return data;
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  // Logout function to clear user data
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
