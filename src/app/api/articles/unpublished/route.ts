import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(_req: NextRequest) {
  try {
    const devApiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.to/api';

    if (!devApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const { data } = await axios.get(`${baseUrl}/articles/me/unpublished`, {
      headers: {
        'api-key': devApiKey,
      },
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data || 'Failed to fetch articles';
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}
