// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

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
      navigate('/login');
    }
  }, [isLoading, user.id, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-background-dark">
        {/* You can add a loading spinner here if you want */}
      </div>
    );
  }

  if (!user.id) {
    return null;
  }

  return <>{children}</>;
};