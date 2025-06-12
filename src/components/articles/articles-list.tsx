"use client";

import { useArticles } from "@/services/hooks/use-articles";
import { useBlogStore } from "@/stores/blog-store";
import { ArticleCard } from "./article-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { getArticleTags } from "@/utils/get-article-normalize";

export function ArticlesList() {
  const { selectedTags, searchQuery, currentPage } = useBlogStore();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      per_page: 20,
      ...(selectedTags.length > 0 && { tags: selectedTags.join(",") }),
    }),
    [selectedTags, currentPage]
  );

  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useArticles(queryParams);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];

    return articles.filter((article) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const articleTags = getArticleTags(article);
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.description.toLowerCase().includes(searchLower) ||
          articleTags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [articles, searchQuery]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erro ao carregar posts</h3>
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar os posts. Tente novamente.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
        <p className="text-muted-foreground">
          {searchQuery || selectedTags.length > 0
            ? "Tente ajustar os filtros de busca."
            : "Não há posts disponíveis no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {filteredArticles.length >= 20 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => {}}>
            Carregar mais posts
          </Button>
        </div>
      )}
    </div>
  );
}
