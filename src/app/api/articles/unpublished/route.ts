import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { z } from 'zod';

const querySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((val) => Number.isInteger(val) && val >= 1, {
      message: 'page must be an integer >= 1',
    })
    .default('1')
    .transform(Number),

  per_page: z
    .string()
    .transform(Number)
    .refine((val) => Number.isInteger(val) && val >= 1 && val <= 1000, {
      message: 'per_page must be an integer between 1 and 1000',
    })
    .default('30')
    .transform(Number),
});

export async function GET(req: NextRequest) {
  try {
    const devApiKey = process.env.NEXT_PUBLIC_API_KEY;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL_DEV_TO || 'https://dev.to/api';

    if (!devApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const parsed = querySchema.safeParse(queryParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { page, per_page } = parsed.data;

    const { data } = await axios.get(`${baseUrl}/articles/me/unpublished`, {
      headers: {
        'api-key': devApiKey,
      },
      params: {
        page,
        per_page,
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
