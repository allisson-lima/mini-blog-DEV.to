'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        await refreshAuth();
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const interval = setInterval(
      () => {
        refreshAuth();
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refreshAuth, setLoading]);

  return <>{children}</>;
}
