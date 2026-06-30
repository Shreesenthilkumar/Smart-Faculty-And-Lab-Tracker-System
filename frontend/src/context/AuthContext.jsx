import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore the session from localStorage on first load so a page refresh
  // doesn't bounce the person back to the login screen.
  useEffect(() => {
    const storedToken = localStorage.getItem("ft_token");
    const storedUser = localStorage.getItem("ft_user");
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("ft_token");
        localStorage.removeItem("ft_user");
      }
    }
    setInitializing(false);
  }, []);

  async function login(email, password) {
    const result = await loginRequest(email, password);
    const loggedInUser = {
      userId: result.userId,
      name: result.name,
      email: result.email,
      role: result.role,
    };
    localStorage.setItem("ft_token", result.token);
    localStorage.setItem("ft_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");
    setUser(null);
  }

  const value = {
    user,
    initializing,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
