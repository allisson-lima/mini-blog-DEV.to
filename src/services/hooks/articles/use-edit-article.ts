'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Article, CreateArticlePayload } from '@/types/article';
import { normalizeArticle } from '@/lib/articles';
import { toast } from 'sonner';
import { api } from '../../api';
import { api_dev } from '../../api.dev.to';

export const useArticleForEdit = (articleId: string) => {
  return useQuery({
    queryKey: ['article-edit', articleId],
    queryFn: async () => {
      try {
        const response = await api_dev.get<Article>(`/articles/${articleId}`);
        return normalizeArticle(response.data);
      } catch (error) {
        console.error('Erro ao buscar artigo para edição:', error);
        throw error;
      }
    },
    enabled: !!articleId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Article,
    Error,
    { articleId: string; data: CreateArticlePayload }
  >({
    mutationFn: async ({ articleId, data }) => {
      try {
        const response = await api.put<Article>(
          `/api/articles/${articleId}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.NEXT_PUBLIC_API_KEY!,
            },
          },
        );
        return normalizeArticle(response.data);
      } catch (error) {
        console.error('Erro ao atualizar artigo:', error);
        throw error;
      }
    },
    onSuccess: (updatedArticle) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['infiniteArticles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['unpublished-articles'] });
      queryClient.invalidateQueries({
        queryKey: ['article', updatedArticle.id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['article-edit', updatedArticle.id.toString()],
      });

      toast.success('Artigo atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar artigo');
      console.error('Erro na atualização:', error);
    },
  });
};
