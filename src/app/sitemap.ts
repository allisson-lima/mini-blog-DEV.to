import { getArticles } from '@/lib/articles';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://devblog.com';

  const articles = await getArticles({ per_page: 100 });

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/posts/${article.id}`,
    lastModified: article.edited_at || article.published_at,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...articleUrls];
}
