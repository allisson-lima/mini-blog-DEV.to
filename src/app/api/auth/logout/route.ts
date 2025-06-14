import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({
      message: 'Logout realizado com sucesso',
    });

    res.cookies.delete('access-token');
    res.cookies.delete('refresh-token');

    return res;
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
