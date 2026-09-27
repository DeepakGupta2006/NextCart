import { createContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser, updateProfile } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("nextcart_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await fetchMe();
        setUser(user);
      } catch (err) {
        localStorage.removeItem("nextcart_token");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (payload) => {
    const { token, user } = await loginUser(payload);
    localStorage.setItem("nextcart_token", token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { token, user } = await registerUser(payload);
    localStorage.setItem("nextcart_token", token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("nextcart_token");
    setUser(null);
  };

  const updateMe = async (payload) => {
    const { user } = await updateProfile(payload);
    setUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateMe }}>
      {children}
    </AuthContext.Provider>
  );
};
