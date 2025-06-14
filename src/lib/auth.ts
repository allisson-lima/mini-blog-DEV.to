/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-here',
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || 'your-refresh-secret-here',
);

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: 'user' | 'admin';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function generateAccessToken(user: User): Promise<string> {
  return await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(
  token: string,
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutos
    path: '/',
  });

  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access-token');
  cookieStore.delete('refresh-token');
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return null;
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return null;
    }

    const user = await getUserById(payload.userId);
    return user;
  } catch (error) {
    return null;
  }
}

const MOCK_USERS: User[] = [
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
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    avatar: '/placeholder.svg?height=40&width=40',
    role: 'user',
  },
];

export async function getUserById(id: string): Promise<User | null> {
  return MOCK_USERS.find((user) => user.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return MOCK_USERS.find((user) => user.email === email) || null;
}

export async function validateCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (user && password === '123456') {
    return user;
  }
  return null;
}
