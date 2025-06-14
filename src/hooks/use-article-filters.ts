'use client';

import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
  parseAsArrayOf,
} from 'nuqs';
import type { ArticlesQueryParams } from '@/types/article';

const stateOptions = ['fresh', 'rising', 'all'] as const;

export function useArticleFilters() {
  const [filters, setFilters] = useQueryStates({
    tag: parseAsString,
    tags: parseAsArrayOf(parseAsString, ','),
    tags_exclude: parseAsArrayOf(parseAsString, ','),
    username: parseAsString,
    state: parseAsStringEnum(Array.from(stateOptions)),
    top: parseAsInteger,
    collection_id: parseAsInteger,
    search: parseAsString,
  });

  const clearFilters = () => {
    setFilters({
      tag: null,
      tags: null,
      tags_exclude: null,
      username: null,
      state: null,
      top: null,
      collection_id: null,
      search: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== undefined,
  );

  const queryParams: Omit<ArticlesQueryParams, 'page' | 'per_page'> = {
    ...(filters.tag && { tag: filters.tag }),
    ...(filters.tags &&
      filters.tags.length > 0 && { tags: filters.tags.join(',') }),
    ...(filters.tags_exclude &&
      filters.tags_exclude.length > 0 && {
        tags_exclude: filters.tags_exclude.join(','),
      }),
    ...(filters.username && { username: filters.username }),
    ...(filters.state && { state: filters.state }),
    ...(filters.top && { top: filters.top }),
    ...(filters.collection_id && { collection_id: filters.collection_id }),
  };

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    queryParams,
    searchQuery: filters.search || '',
    setSearchQuery: (search: string | null) => setFilters({ search }),
  };
}
