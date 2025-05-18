// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Welcome from "./Welcome";
import SideBar from "./SideBar";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!isLoading && !user.id) {
      navigate("/login");
    }
  }, [isLoading, user.id, navigate]);

  if (isLoading) {
    return (
      <>
        <div className="hidden md:flex">
          <div className="w-[4%] h-screen bg-surface  text-white border-r border-gray-700">
            <SideBar />
          </div>

          <div className="w-[25%] h-screen bg-background text-white overflow-y-auto border border-gray-800"></div>
          <div className="flex-1 h-screen bg-background-dark text-white overflow-y-auto">
            <Welcome />
          </div>
        </div>

        <div className="flex items-center text-sm justify-center h-screen text-center text-white bg-background-dark md:hidden">
          This is is a desktop client. Please open it on a desktop device.
        </div>
      </>
    );
  }

  if (!user.id) {
    return null;
  }

  return <>{children}</>;
};
