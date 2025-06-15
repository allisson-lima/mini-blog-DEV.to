import { NextRequest, NextResponse } from 'next/server';
import {
  verifyRefreshToken,
  getUserById,
  generateAccessToken,
  generateRefreshToken,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token não encontrado' },
        { status: 401 },
      );
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Refresh token inválido' },
        { status: 401 },
      );
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user.id);

    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    });

    const isProd = process.env.NODE_ENV === 'production';

    res.cookies.set('access-token', newAccessToken, {
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1 * 60,
      path: '/',
    });

    res.cookies.set('refresh-token', newRefreshToken, {
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Erro no refresh:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
