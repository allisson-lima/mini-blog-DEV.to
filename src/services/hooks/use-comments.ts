'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment } from '@/types/article';
import { useBlogStore } from '@/stores/blog-store';
import { toast } from 'sonner';
import { api } from '../api';

const fetchComments = async (articleId: string): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/comments?a_id=${articleId}`);
  return response.data;
};

export const useComments = (articleId: string) => {
  const { setComments } = useBlogStore();

  return useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      try {
        const data = await fetchComments(articleId);
        setComments(articleId, data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!articleId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { addComment } = useBlogStore();

  return useMutation({
    mutationFn: async ({
      articleId,
      body,
    }: {
      articleId: string;
      body: string;
    }) => {
      const newComment: Comment = {
        id: crypto.randomUUID(),
        body_html: `<p>${body}</p>`,
        body_markdown: body,
        created_at: new Date().toISOString(),
        user: {
          name: 'Usuário Atual',
          username: 'current_user',
          profile_image: '/placeholder.svg?height=40&width=40',
        },
      };
      return { articleId, comment: newComment };
    },
    onSuccess: ({ articleId, comment }) => {
      addComment(articleId, comment);
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      toast.success('Comentário adicionado!');
    },
    onError: () => {
      toast.error('Erro ao adicionar comentário');
    },
  });
};
