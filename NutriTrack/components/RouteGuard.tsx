import React from 'react';
import { useAuth } from '@/app/_layout';
import { router } from 'expo-router';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/(screens)/loginScreen');
    }
  }, [user, isLoading]);

  if (isLoading) return null;
  return <>{user ? children : null}</>;
} 