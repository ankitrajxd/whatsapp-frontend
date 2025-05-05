import { create } from "zustand";

interface User {
  name: string;
  email: string;
  profileImage: string;
}

interface AuthState {
  user: User;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: "",
    email: "",
    profileImage: "",
  },

  setUser: (user: User) => set({ user }),
}));

export { useAuthStore };
