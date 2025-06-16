import { User } from '@/lib/auth';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    avatar: '/placeholder.svg?height=40&width=40',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Allisson Lima',
    email: 'allison@example.com',
    username: 'allisson_lima',
    avatar: '/placeholder.svg?height=40&width=40',
    role: 'user',
  },
];
