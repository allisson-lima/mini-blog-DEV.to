import { ArticlesList } from '@/components/articles/articles-list';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const title = `DevBlog`;
  const description = 'Um mini-blog/CMS moderno construído com Next.js 15';

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/placeholder.svg`;

  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/placeholder.svg`;

  return {
    title,
    description,
    authors: [
      {
        name: 'Allisson Lima',
        url: `https://github.com/allisson-lima`,
      },
    ],
    keywords: ['blog', 'dev'],
    openGraph: {
      title,
      description,
      type: 'article',
      authors: [`https://github.com/allisson-lima`],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Posts Recentes</h1>
          <p className="text-muted-foreground">
            Descubra os últimos artigos da comunidade dev.to
          </p>
        </div>
        <ArticlesList />
      </div>
    </div>
  );
}
