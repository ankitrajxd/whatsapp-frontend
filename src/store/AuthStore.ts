/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface AuthState {
  user: User;
  setUser: (user: User) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthStore = create<AuthState>((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    profileImage: "",
  },

  setUser: (user: User) => set({ user }),
  fetchCurrentUser: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users/me`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const user = response.data.data;
        set({ user });
      }
    } catch (error: unknown) {
      // Reset user on error (e.g., not authenticated)
      set({
        user: {
          id: "",
          name: "",
          email: "",
          profileImage: "",
        },
      });
    }
  },
  logout: async () => {
    const res = await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
      withCredentials: true,
    });

    console.log(res.data);
    if (res.status === 200) {
      set({
        user: {
          id: "",
          name: "",
          email: "",
          profileImage: "",
        },
      });
    }
  },
}));

export { AuthStore };
