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
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
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

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro no login');
          }

          const data = await response.json();
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
          await fetch('/api/auth/logout', {
            method: 'POST',
          });

          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Erro no logout:', error);
          // Mesmo com erro, limpa o estado local
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      refreshAuth: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              isAuthenticated: true,
            });
          } else {
            // Se o refresh falhar, desloga o usuário
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Erro no refresh:', error);
          set({
            user: null,
            isAuthenticated: false,
          });
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
