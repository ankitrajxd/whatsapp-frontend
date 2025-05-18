import { AuthStore } from "../store/AuthStore";

export const useAuth = () => {
  const { user, setUser, fetchCurrentUser } = AuthStore();

  return {
    user,
    setUser,
    fetchCurrentUser,
  };
};
