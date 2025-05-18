// src/components/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (!user.id) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
};