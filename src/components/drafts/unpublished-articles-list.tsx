/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  FileText,
  Plus,
  Eye,
  Clock,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  PenTool,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatNumber } from '@/utils/format-number';
import { getArticleTags } from '@/utils/get-article-normalize';
import { useUnpublishedArticles } from '@/services/hooks/articles/use-unpublished-articles';

export function UnpublishedArticlesList() {
  const {
    data: articlesData,
    isLoading,
    error,
    pagination,
    setPage,
    setPerPage,
    publishArticle,
    isPublishing,
    refetch,
  } = useUnpublishedArticles();

  const handlePublishArticle = async (
    articleId: number,
    articleTitle: string,
  ) => {
    try {
      await publishArticle(articleId);
    } catch (error) {
      console.error(`Erro ao publicar artigo ${articleTitle}:`, error);
    }
  };

  const handleDeleteArticle = async (
    articleId: number,
    articleTitle: string,
  ) => {
    try {
      toast.success(`Rascunho "${articleTitle}" excluído com sucesso!`);
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir rascunho');
    }
  };

  if (isLoading && !articlesData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Erro ao carregar rascunhos
        </h3>
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar seus rascunhos. Tente novamente.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <PenTool className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!articlesData) {
    return null;
  }

  const { articles, total, totalPages, currentPage } = articlesData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PenTool className="h-8 w-8" />
            Meus Rascunhos
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus artigos não publicados. Total: {total} rascunhos
          </p>
        </div>
        <Link href="/account/post/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Rascunho
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Artigos Não Publicados ({total})
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Itens por página:
              </span>
              <Select
                value={pagination.per_page.toString()}
                onValueChange={(value) => setPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {article.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        <PenTool className="h-3 w-3 mr-1" />
                        Rascunho
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {(article?.created_at ||
                        article?.published_timestamp) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Criado em{' '}
                            {format(
                              new Date(
                                article?.created_at ||
                                  article?.published_timestamp,
                              ),
                              'dd/MM/yyyy',
                              {
                                locale: ptBR,
                              },
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {article.reading_time_minutes} min de leitura
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>
                          {formatNumber(article.page_views_count || 0)}{' '}
                          visualizações
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {getArticleTags(article)
                        .slice(0, 3)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      {getArticleTags(article).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{getArticleTags(article).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={isPublishing}
                        >
                          {isPublishing ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Globe className="h-4 w-4" />
                              Publicar
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Publicar Artigo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja publicar o artigo "
                            {article.title}"? Ele ficará visível publicamente
                            após a publicação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handlePublishArticle(article.id, article.title)
                            }
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Publicar Agora
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild disabled>
                          <Link
                            href={`/posts/${article.user.username}/${article.slug}`}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Visualizar Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild disabled>
                          <Link
                            href={`/account/edit/${article.id}`}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Editar Rascunho
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild disabled>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Ver no dev.to
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir Rascunho
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir Rascunho
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o rascunho "
                                {article.title}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteArticle(article.id, article.title)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

            {articles.length === 0 && (
              <div className="text-center py-12">
                <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum rascunho encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Você não tem rascunhos no momento. Comece criando um novo
                  artigo!
                </p>
                <Link href="/account/post/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Rascunho
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({total} rascunhos)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
