import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const demoUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  avatar: '/placeholder.svg?height=40&width=40',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: demoUser,
      isLoggedIn: true,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
