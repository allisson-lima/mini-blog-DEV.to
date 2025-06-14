'use client';

import { useQueryStates, parseAsInteger } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/types/article';
import { normalizeArticle } from '@/lib/articles';
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
      },
    });

    const articles = response.data.map(normalizeArticle);
    const total = articles.length;
    const totalPages = Math.ceil(total / params.per_page);

    return {
      articles,
      total,
      totalPages,
      currentPage: params.page,
    };
  } catch (error) {
    console.error('Erro ao buscar artigos do admin:', error);
    throw error;
  }
};

export function Unpublished() {
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
    queryKey: ['account-articles', pagination],
    queryFn: () => fetchArticlesUnpublished(pagination),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    ...query,
    pagination,
    setPagination,
    setPage: (page: number) => setPagination({ page }),
    setPerPage: (per_page: number) => setPagination({ per_page, page: 1 }),
  };
}
