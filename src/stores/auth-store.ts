import { api } from '@/services/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  session: () => Promise<User>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { data } = await api.post('/api/auth/login', {
            email,
            password,
          });

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
          }
        } catch (error) {
          console.error('Erro no logout:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      refreshAuth: async () => {
        try {
          const { data } = await api.post('/api/auth/refresh');
          set({
            user: data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Erro no refresh:', error);
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      session: async () => {
        try {
          set({ isLoading: true });
          const { data } = await api.get('/api/session');
          set({
            user: data.user,
            isAuthenticated: true,
          });
          return data.user;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
