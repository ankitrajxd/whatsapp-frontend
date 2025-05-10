/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { create } from "zustand";

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
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "",
    name: "",
    email: "",
    profileImage: "",
  },

  setUser: (user: User) => set({ user }),
  fetchCurrentUser: async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/me", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const user = response.data.message;
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
}));

export { useAuthStore };
