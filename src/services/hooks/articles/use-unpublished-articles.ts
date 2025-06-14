'use client';

import { useQueryStates, parseAsInteger } from 'nuqs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Article } from '@/types/article';
import { normalizeArticle } from '@/lib/articles';
import { toast } from 'sonner';
import { api } from '../../api';

interface ArticlesUnpublishedParams {
  page: number;
  per_page: number;
}

interface ArticlesUnpublishedResponse {
  articles: Article[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const fetchArticlesUnpublished = async (
  params: ArticlesUnpublishedParams,
): Promise<ArticlesUnpublishedResponse> => {
  try {
    const response = await api.get<Article[]>('/api/articles/unpublished', {
      params: {
        page: params.page,
        per_page: params.per_page,
        username: 'allisson_lima',
        state: 'all',
      },
    });

    const unpublishedArticles = response.data
      .map(normalizeArticle)
      .filter(
        (article) => !article.published_at || article.published === false,
      );

    const total = unpublishedArticles.length;
    const totalPages = Math.ceil(total / params.per_page);

    const startIndex = (params.page - 1) * params.per_page;
    const endIndex = startIndex + params.per_page;
    const paginatedArticles = unpublishedArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total,
      totalPages,
      currentPage: params.page,
    };
  } catch (error) {
    console.error('Erro ao buscar rascunhos:', error);
    throw error;
  }
};

const publishArticle = async (articleId: number): Promise<Article> => {
  try {
    const response = await api.put<Article>(`/api/articles/${articleId}`, {
      article: {
        published: true,
      },
    });
    return normalizeArticle(response.data);
  } catch (error) {
    console.error('Erro ao publicar artigo:', error);
    throw error;
  }
};

export function useUnpublishedArticles() {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(10),
    },
    {
      history: 'push',
      shallow: false,
    },
  );

  const query = useQuery({
    queryKey: ['unpublished-articles', pagination],
    queryFn: () => fetchArticlesUnpublished(pagination),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const publishMutation = useMutation({
    mutationFn: publishArticle,
    onSuccess: (publishedArticle) => {
      queryClient.invalidateQueries({ queryKey: ['unpublished-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });

      toast.success(
        `Artigo "${publishedArticle.title}" publicado com sucesso!`,
      );
    },
    onError: (error) => {
      console.error('Erro ao publicar artigo:', error);
      toast.error('Erro ao publicar artigo. Tente novamente.');
    },
  });

  return {
    ...query,
    pagination,
    setPagination,
    setPage: (page: number) => setPagination({ page }),
    setPerPage: (per_page: number) => setPagination({ per_page, page: 1 }),
    publishArticle: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
  };
}
