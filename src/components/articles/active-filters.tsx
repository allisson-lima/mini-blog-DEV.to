'use client';

import { Badge } from '@/components/ui/badge';
import { useArticleFilters } from '@/hooks/use-article-filters';
import {
  X,
  Tag,
  User,
  TrendingUp,
  Calendar,
  Globe,
  Sparkles,
  Flame,
} from 'lucide-react';

export function ActiveFilters() {
  const { filters, setFilters, hasActiveFilters } = useArticleFilters();

  if (!hasActiveFilters) return null;

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'fresh':
        return <Sparkles className="h-3 w-3" />;
      case 'rising':
        return <Flame className="h-3 w-3" />;
      case 'all':
        return <Globe className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'fresh':
        return 'Fresh';
      case 'rising':
        return 'Rising';
      case 'all':
        return 'Todos';
      default:
        return state;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">
        Filtros ativos:
      </span>

      {filters.tag && (
        <Badge variant="secondary" className="gap-1">
          <Tag className="h-3 w-3" />
          Tag: {filters.tag}
          <button
            onClick={() => setFilters({ tag: null })}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.tags &&
        filters.tags.map((tag) => (
          <Badge key={`include-${tag}`} variant="default" className="gap-1">
            <Tag className="h-3 w-3" />+{tag}
            <button
              onClick={() => {
                const newTags = filters.tags!.filter((t) => t !== tag);
                setFilters({ tags: newTags.length > 0 ? newTags : null });
              }}
              className="ml-1 hover:text-primary-foreground/70"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

      {filters.tags_exclude &&
        filters.tags_exclude.map((tag) => (
          <Badge key={`exclude-${tag}`} variant="destructive" className="gap-1">
            <Tag className="h-3 w-3" />-{tag}
            <button
              onClick={() => {
                const newTags = filters.tags_exclude!.filter((t) => t !== tag);
                setFilters({
                  tags_exclude: newTags.length > 0 ? newTags : null,
                });
              }}
              className="ml-1 hover:text-destructive-foreground/70"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

      {filters.username && (
        <Badge variant="outline" className="gap-1">
          <User className="h-3 w-3" />@{filters.username}
          <button
            onClick={() => setFilters({ username: null })}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.state && (
        <Badge variant="outline" className="gap-1">
          {getStateIcon(filters.state)}
          {getStateLabel(filters.state)}
          <button
            onClick={() => setFilters({ state: null })}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.top && (
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          Top {filters.top} dias
          <button
            onClick={() => setFilters({ top: null })}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.collection_id && (
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          Coleção #{filters.collection_id}
          <button
            onClick={() => setFilters({ collection_id: null })}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
