import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/articles/article-view';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { getArticleById } from '@/lib/articles';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: 'Artigo não encontrado | DevBlog',
      description:
        'O artigo que você está procurando não existe ou foi removido.',
    };
  }

  const description =
    article.description ||
    article.body_markdown.substring(0, 160).trim() + '...';

  const canonicalUrl =
    article.canonical_url ||
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devblog.com'}/posts/${id}`;

  const imageUrl =
    article.cover_image ||
    article.social_image ||
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devblog.com'}/api/og?title=${encodeURIComponent(article.title)}`;

  return {
    title: `${article.title} | DevBlog`,
    description,
    authors: [
      {
        name: article.user.name,
        url: `https://dev.to/${article.user.username}`,
      },
    ],
    keywords: article.tag_list
      ? typeof article.tag_list === 'string'
        ? article.tag_list
        : article.tag_list
      : [],
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.edited_at || undefined,
      authors: [`https://dev.to/${article.user.username}`],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      tags: article.tag_list
        ? typeof article.tag_list === 'string'
          ? article?.tag_list
          : article.tag_list
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
      creator: article.user.twitter_username
        ? `@${article.user.twitter_username}`
        : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description:
      article.description ||
      article.body_markdown.substring(0, 160).trim() + '...',
    image: article.cover_image || article.social_image,
    datePublished: article.published_at,
    dateModified: article.edited_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.user.name,
      url: `https://dev.to/${article.user.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevBlog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devblog.com'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://devblog.com'}/posts/${id}`,
    },
  };

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8">
        <ErrorBoundary>
          <ArticleView article={article} articleId={id} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
