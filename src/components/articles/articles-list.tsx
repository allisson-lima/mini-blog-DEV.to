'use client';

import { ArticleCard } from './article-card';
import { ArticleFilters } from './article-filters';
import { ActiveFilters } from './active-filters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useArticleFilters } from '@/hooks/use-article-filters';
import { useInfiniteArticles } from '@/services/hooks/use-articles';
import { getArticleTags } from '@/utils/get-article-normalize';

export function ArticlesList() {
  const { queryParams, searchQuery } = useArticleFilters();
  const { ref, inView } = useInView();

  const finalQueryParams = useMemo(
    () => ({
      per_page: 20,
      ...queryParams,
    }),
    [queryParams],
  );

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArticles(finalQueryParams);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allArticles = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.articles);
  }, [data]);

  const filteredArticles = useMemo(() => {
    if (!allArticles) return [];

    return allArticles.filter((article) => {
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
  }, [allArticles, searchQuery]);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ArticleFilters />
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ArticleFilters />
      <ActiveFilters />
      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
          <p className="text-muted-foreground">
            {searchQuery || Object.keys(queryParams).length > 0
              ? 'Tente ajustar os filtros de busca.'
              : 'Não há posts disponíveis no momento.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div ref={ref} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Carregando mais posts...</span>
              </div>
            ) : hasNextPage ? (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                Carregar mais posts
              </Button>
            ) : filteredArticles.length > 0 ? (
              <p className="text-muted-foreground text-sm">
                Você chegou ao fim dos posts
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
