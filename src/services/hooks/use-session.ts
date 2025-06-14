'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/stores/auth-store';

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useQuery({
    queryKey: ['current-user'],
    queryFn: async (): Promise<User> => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/session');
        setUser(data.user);
        return data.user;
      } catch (error) {
        setUser(null);
        setLoading(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
  });
}
