import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users/me`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchCurrentUser, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
