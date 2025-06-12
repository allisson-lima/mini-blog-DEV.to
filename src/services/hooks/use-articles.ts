"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  Article,
  ArticlesQueryParams,
  CreateArticlePayload,
} from "@/types/article";
import { useBlogStore } from "@/stores/blog-store";
import { toast } from "sonner";
import { getArticleTags } from "@/utils/get-article-normalize";
import { api } from "../api";
import { queryClient } from "@/lib/query-client-react-query";

const normalizeArticle = (article: Article): Article => {
  return {
    ...article,
    tag_list: getArticleTags(article),
    description: article.description || "",
    cover_image: article.cover_image || article.social_image || "",
    reading_time_minutes: article.reading_time_minutes || 1,
    public_reactions_count: article.public_reactions_count || 0,
    comments_count: article.comments_count || 0,
  };
};

const fetchArticles = async (
  params?: ArticlesQueryParams
): Promise<Article[]> => {
  const config = {
    params: {
      page: 1,
      per_page: 30,
      ...params,
    },
  };

  try {
    const response = await api.get<Article[]>("/articles", config);
    return response.data.map(normalizeArticle);
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    throw error;
  }
};

const fetchArticleById = async (id: string): Promise<Article> => {
  const response = await api.get<Article>(`/articles/${id}`);
  return normalizeArticle(response.data);
};

export const useArticles = (params?: ArticlesQueryParams) => {
  const { setArticles, setArticlesLoading } = useBlogStore();

  return useQuery({
    queryKey: ["articles", params],
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

export const useArticle = (id: string) => {
  const { setCurrentArticle } = useBlogStore();

  return useQuery({
    queryKey: ["article", id],
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
      const response = await api.post<Article>("/articles", payload, {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artigo criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar artigo");
      console.error(error);
    },
  });
};
