import type { Article, ArticlesQueryParams } from '@/types/article';
import { getArticleTags } from '@/utils/get-article-normalize';
import axios from 'axios';

export const normalizeArticle = (article: Article): Article => {
  return {
    ...article,
    tag_list: getArticleTags(article),
    description: article.description || '',
    cover_image: article.cover_image || article.social_image || '',
    reading_time_minutes: article.reading_time_minutes || 1,
    public_reactions_count: article.public_reactions_count || 0,
    comments_count: article.comments_count || 0,
  };
};

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const response = await axios.get<Article>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
    );
    return normalizeArticle(response.data);
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    return null;
  }
}

export async function getArticles(
  params?: ArticlesQueryParams,
): Promise<Article[]> {
  try {
    const config = {
      params: {
        page: 1,
        per_page: 20,
        ...params,
      },
    };
    const response = await axios.get<Article[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      config,
    );
    return response.data.map(normalizeArticle);
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    return [];
  }
}
