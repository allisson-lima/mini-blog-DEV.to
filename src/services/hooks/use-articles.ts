'use client';

import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import type {
  Article,
  ArticlesQueryParams,
  CreateArticlePayload,
} from '@/types/article';
import { useBlogStore } from '@/stores/blog-store';
import { toast } from 'sonner';
import { queryClient } from '@/lib/query-client-react-query';
import { getArticleTags } from '@/utils/get-article-normalize';
import { api } from '../api';
import axios from 'axios';

const normalizeArticle = (article: Article): Article => {
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

const fetchArticles = async (
  params?: ArticlesQueryParams,
): Promise<Article[]> => {
  const config = {
    params: {
      page: 1,
      per_page: 20,
      ...params,
    },
  };

  try {
    const response = await api.get<Article[]>('/articles', config);
    return response.data.map(normalizeArticle);
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    throw error;
  }
};

const fetchArticlesInfinite = async ({
  pageParam = 1,
  queryParams = {},
}: {
  pageParam?: number;
  queryParams?: Omit<ArticlesQueryParams, 'page'>;
}): Promise<{
  articles: Article[];
  nextPage: number | null;
}> => {
  const config = {
    params: {
      page: pageParam,
      per_page: 20,
      ...queryParams,
    },
  };

  try {
    const response = await api.get<Article[]>('/articles', config);
    const articles = response.data.map(normalizeArticle);

    const hasMore = articles.length === 20;
    const nextPage = hasMore ? pageParam + 1 : null;

    return {
      articles,
      nextPage,
    };
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    throw error;
  }
};

const fetchArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await api.get<Article>(`/articles/${id}`);
    return normalizeArticle(response.data);
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    throw error;
  }
};

export const useArticles = (params?: ArticlesQueryParams) => {
  const { setArticles, setArticlesLoading } = useBlogStore();

  return useQuery({
    queryKey: ['articles', params],
    queryFn: async () => {
      setArticlesLoading(true);
      try {
        const data = await fetchArticles(params);
        setArticles(data);
        return data;
      } catch (error) {
        throw error;
      } finally {
        setArticlesLoading(false);
      }
    },
  });
};

export const useInfiniteArticles = (
  queryParams?: Omit<ArticlesQueryParams, 'page'>,
) => {
  const { setArticlesLoading } = useBlogStore();

  return useInfiniteQuery({
    queryKey: ['infiniteArticles', queryParams],
    queryFn: async ({ pageParam }) => {
      if (pageParam === 1) {
        setArticlesLoading(true);
      }

      try {
        return await fetchArticlesInfinite({ pageParam, queryParams });
      } catch (error) {
        throw error;
      } finally {
        if (pageParam === 1) {
          setArticlesLoading(false);
        }
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

export const useArticle = (id: string) => {
  const { setCurrentArticle } = useBlogStore();

  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      try {
        const article = await fetchArticleById(id);
        setCurrentArticle(article);
        return article;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  return useMutation<Article, Error, CreateArticlePayload>({
    mutationFn: async (payload) => {
      const response = await axios.post<Article>('/api/articles', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteArticles'] });
      toast.success('Artigo criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar artigo');
      console.error(error);
    },
  });
};
