'use client';

import { useQueryStates, parseAsInteger } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import type { Article } from '@/types/article';
import { normalizeArticle } from '@/lib/articles';
import { api } from '../../api';

interface AccountArticlesParams {
  page: number;
  per_page: number;
}

interface AccountArticlesResponse {
  articles: Article[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const fetchAccountArticles = async (
  params: AccountArticlesParams,
): Promise<AccountArticlesResponse> => {
  try {
    const response = await api.get<Article[]>('/api/articles/me/all', {
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

export function useAccountArticles() {
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
    queryFn: () => fetchAccountArticles(pagination),
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
