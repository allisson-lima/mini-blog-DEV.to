'use client';

import { useState, useMemo } from 'react';
import { useArticles } from '@/services/hooks/articles/use-articles';
import { useBlogStore } from '@/stores/blog-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Tag, TrendingUp } from 'lucide-react';
import { getArticleTags } from '@/utils/get-article-normalize';

export function TagsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: articles, isLoading } = useArticles({
    per_page: 500,
  });
  const { selectedTags, toggleTag } = useBlogStore();

  const tagStats = useMemo(() => {
    if (!articles) return [];

    const tagCounts = new Map<string, number>();

    articles.forEach((article) => {
      const articleTags = getArticleTags(article);
      articleTags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const filteredTags = useMemo(() => {
    return tagStats.filter(({ tag }) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tagStats, searchQuery]);

  const popularTags = tagStats.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Gerenciar Tags
          </h1>
          <p className="text-muted-foreground">
            Explore e gerencie as tags dos posts
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Tags</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-24 rounded-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.map(({ tag, count }) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? 'default' : 'secondary'
                        }
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag} ({count})
                      </Badge>
                    ))}
                  </div>
                  {filteredTags.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma tag encontrada
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tags Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {popularTags.map(({ tag, count }, index) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Badge
                          variant={
                            selectedTags.includes(tag) ? 'default' : 'outline'
                          }
                        >
                          #{tag}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} posts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags Selecionadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-2 rounded-lg bg-primary/10"
                    >
                      <Badge variant="default">#{tag}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTag(tag)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
