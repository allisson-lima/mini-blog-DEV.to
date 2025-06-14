import { type NextRequest, NextResponse } from 'next/server';
import {
  validateCredentials,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 },
      );
    }

    const user = await validateCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 },
      );
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
