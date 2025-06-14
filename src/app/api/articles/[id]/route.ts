import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';

const updateArticleSchema = z.object({
  article: z.object({
    title: z.string().min(1).optional(),
    published: z.boolean().optional(),
    body_markdown: z.string().optional(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
  }),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const devApiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL_DEV_TO || 'https://dev.to/api';

    if (!devApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const articleId = id;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Missing article ID' },
        { status: 400 },
      );
    }

    const json = await req.json();

    const parsed = updateArticleSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { data } = await axios.put(
      `${baseUrl}/articles/${articleId}`,
      parsed.data,
      {
        headers: {
          'api-key': devApiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data || 'Failed to update article';
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 },
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const devApiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL_DEV_TO || 'https://dev.to/api';

    if (!devApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const articleId = id;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Missing article ID' },
        { status: 400 },
      );
    }

    const { data } = await axios.get(`${baseUrl}/articles/${articleId}`);

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data || 'Failed to fetch article';
      return NextResponse.json({ error: errorMessage }, { status });
    }

    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 },
    );
  }
}
