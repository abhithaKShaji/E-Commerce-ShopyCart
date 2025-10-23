// src/context/UserAuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string; // "user"
}

interface UserAuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_data");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("user_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_token");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within a UserAuthProvider");
  return ctx;
};
