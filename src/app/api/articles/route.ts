import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';

const articleSchema = z.object({
  article: z.object({
    title: z.string(),
    published: z.boolean(),
    body_markdown: z.string(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = articleSchema.parse(body);

    const devApiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.to/api';

    if (!devApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const { data } = await axios.post(`${baseUrl}/articles`, validated, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': devApiKey,
      },
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data || 'Failed to publish article';
      return NextResponse.json({ error: errorMessage }, { status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 },
    );
  }
}
