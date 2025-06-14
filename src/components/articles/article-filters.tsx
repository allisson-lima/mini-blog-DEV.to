'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Filter,
  X,
  User,
  Tag,
  TrendingUp,
  Calendar,
  Sparkles,
  Flame,
  Globe,
  Settings2,
  Loader2,
} from 'lucide-react';
import { useArticleFilters } from '@/hooks/use-article-filters';
import { useDebounce } from '@/hooks/use-debounce';

export function ArticleFilters() {
  const { filters, setFilters, clearFilters, hasActiveFilters } =
    useArticleFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [excludeTagInput, setExcludeTagInput] = useState('');

  const [localTag, setLocalTag] = useState(filters.tag || '');
  const [localUsername, setLocalUsername] = useState(filters.username || '');
  const [localCollectionId, setLocalCollectionId] = useState(
    filters.collection_id?.toString() || '',
  );

  const debouncedTag = useDebounce(localTag, 1000);
  const debouncedUsername = useDebounce(localUsername, 1000);
  const debouncedCollectionId = useDebounce(localCollectionId, 1000);

  const [isTagLoading, setIsTagLoading] = useState(false);
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);

  useEffect(() => {
    if (!filters.tag) {
      setLocalTag('');
    }
    if (!filters.username) {
      setLocalUsername('');
    }
    if (!filters.collection_id) {
      setLocalCollectionId('');
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalCollectionId(filters.collection_id?.toString() || '');
  }, [filters.collection_id]);

  useEffect(() => {
    if (debouncedTag !== (filters.tag || '')) {
      setFilters({ tag: debouncedTag || null });
      setIsTagLoading(false);
    }
  }, [debouncedTag]);

  useEffect(() => {
    if (debouncedUsername !== (filters.username || '')) {
      setFilters({ username: debouncedUsername || null });
      setIsUsernameLoading(false);
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (debouncedCollectionId !== (filters.collection_id?.toString() || '')) {
      const collectionId = debouncedCollectionId
        ? Number.parseInt(debouncedCollectionId)
        : null;
      setFilters({ collection_id: collectionId });
      setIsCollectionLoading(false);
    }
  }, [debouncedCollectionId]);

  const handleTagChange = (value: string) => {
    setLocalTag(value);
    if (value !== (filters.tag || '')) {
      setIsTagLoading(true);
    }
  };

  const handleUsernameChange = (value: string) => {
    setLocalUsername(value);
    if (value !== (filters.username || '')) {
      setIsUsernameLoading(true);
    }
  };

  const handleCollectionIdChange = (value: string) => {
    setLocalCollectionId(value);
    if (value !== (filters.collection_id?.toString() || '')) {
      setIsCollectionLoading(true);
    }
  };

  const handleAddTag = (type: 'tags' | 'tags_exclude') => {
    const input = type === 'tags' ? tagInput : excludeTagInput;
    if (!input.trim()) return;

    const currentTags = filters[type] || [];
    const newTags = [...currentTags, input.trim()];

    setFilters({ [type]: newTags });

    if (type === 'tags') {
      setTagInput('');
    } else {
      setExcludeTagInput('');
    }
  };

  const handleRemoveTag = (
    type: 'tags' | 'tags_exclude',
    tagToRemove: string,
  ) => {
    const currentTags = filters[type] || [];
    const newTags = currentTags.filter((tag) => tag !== tagToRemove);
    setFilters({ [type]: newTags.length > 0 ? newTags : null });
  };

  const handleClearFilters = () => {
    clearFilters();

    setLocalTag('');
    setLocalUsername('');
    setLocalCollectionId('');

    setTagInput('');
    setExcludeTagInput('');

    setIsTagLoading(false);
    setIsUsernameLoading(false);
    setIsCollectionLoading(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.tag) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.tags_exclude && filters.tags_exclude.length > 0) count++;
    if (filters.username) count++;
    if (filters.state) count++;
    if (filters.top) count++;
    if (filters.collection_id) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={filters.state === 'fresh' ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setFilters({ state: filters.state === 'fresh' ? null : 'fresh' })
            }
            className="gap-2 whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden xs:inline">Fresh</span>
          </Button>

          <Button
            variant={filters.state === 'rising' ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setFilters({
                state: filters.state === 'rising' ? null : 'rising',
              })
            }
            className="gap-2 whitespace-nowrap"
          >
            <Flame className="h-4 w-4" />
            <span className="hidden xs:inline">Rising</span>
          </Button>

          <Button
            variant={filters.top ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ top: filters.top ? null : 7 })}
            className="gap-2 whitespace-nowrap"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Top 7 dias</span>
            <span className="sm:hidden">Top 7d</span>
          </Button>

          <Separator orientation="vertical" className="h-8 hidden sm:block" />

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 relative whitespace-nowrap"
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros Avançados</span>
                <span className="sm:hidden">Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[calc(100vw-2rem)] sm:w-96 p-0 max-h-[80vh] overflow-y-auto"
              align="start"
              side="bottom"
              sideOffset={8}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros Avançados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tag Principal
                      {isTagLoading && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </Label>
                    <Input
                      placeholder="Ex: javascript"
                      value={localTag}
                      onChange={(e) => handleTagChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Busca por uma tag específica (ordena por popularidade)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Tags Incluídas
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), handleAddTag('tags'))
                        }
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddTag('tags')}
                        disabled={!tagInput.trim()}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    {filters.tags && filters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {filters.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            #{tag}
                            <button
                              onClick={() => handleRemoveTag('tags', tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Posts que contenham qualquer uma dessas tags
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Tags Excluídas
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Excluir tag..."
                        value={excludeTagInput}
                        onChange={(e) => setExcludeTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), handleAddTag('tags_exclude'))
                        }
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddTag('tags_exclude')}
                        disabled={!excludeTagInput.trim()}
                        className="whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>
                    {filters.tags_exclude &&
                      filters.tags_exclude.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {filters.tags_exclude.map((tag) => (
                            <Badge
                              key={tag}
                              variant="destructive"
                              className="gap-1"
                            >
                              #{tag}
                              <button
                                onClick={() =>
                                  handleRemoveTag('tags_exclude', tag)
                                }
                                className="ml-1 hover:text-destructive-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    <p className="text-xs text-muted-foreground">
                      Posts que NÃO contenham essas tags
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Usuário
                      {isUsernameLoading && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </Label>
                    <Input
                      placeholder="Ex: ben"
                      value={localUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Posts de um usuário específico
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Estado
                    </Label>
                    <Select
                      value={filters.state || 'all'}
                      onValueChange={(value) =>
                        setFilters({
                          state: (value as 'fresh' | 'rising' | 'all') || null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar estado..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="fresh">Fresh (Novos)</SelectItem>
                        <SelectItem value="rising">Rising (Em alta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Mais populares dos últimos N dias
                    </Label>
                    <Select
                      value={filters.top?.toString() || '0'}
                      onValueChange={(value) =>
                        setFilters({
                          top: value ? Number.parseInt(value) : null,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar período..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Desabilitado</SelectItem>
                        <SelectItem value="1">1 dia</SelectItem>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      Collection ID
                      {isCollectionLoading && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </Label>
                    <Input
                      type="number"
                      placeholder="Ex: 99"
                      value={localCollectionId}
                      onChange={(e) => handleCollectionIdChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Posts de uma coleção específica
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button onClick={() => setIsOpen(false)} className="flex-1">
                      Aplicar Filtros
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="sm:w-auto"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2 self-start sm:self-center whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Limpar filtros</span>
            <span className="sm:hidden">Limpar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
