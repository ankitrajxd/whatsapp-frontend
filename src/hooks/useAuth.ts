import { AuthStore } from "../store/AuthStore";

export const useAuth = () => {
  const user = AuthStore((state) => state.user);
  const setUser = AuthStore((state) => state.setUser);
  const fetchCurrentUser = AuthStore((state) => state.fetchCurrentUser);

  const isLoggedIn = !!user.id;

  return {
    user,
    setUser,
    fetchCurrentUser,
    isLoggedIn,
  };
};
