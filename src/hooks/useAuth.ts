import { AuthStore } from "../store/AuthStore";

export const useAuth = () => {
  const { user, setUser, fetchCurrentUser, logout } = AuthStore();

  return {
    user,
    setUser,
    fetchCurrentUser,
    logout,
  };
};
