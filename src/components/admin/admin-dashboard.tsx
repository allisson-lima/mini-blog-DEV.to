/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useBlogStore } from '@/stores/blog-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FileText,
  PenTool,
  Tag,
  TrendingUp,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAccountArticles } from '@/services/hooks/articles/use-articles-me';
import { getArticleTags } from '@/utils/get-article-normalize';
import { formatNumber } from '@/utils/format-number';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
];

export function AdminDashboard() {
  const { drafts } = useBlogStore();
  const { user } = useAuthStore();
  const {
    data: articlesData,
    isLoading,
    pagination,
    setPage,
    setPerPage,
  } = useAccountArticles();

  const stats = useMemo(() => {
    if (!articlesData) return null;

    const { articles } = articlesData;
    const tagCounts = new Map<string, number>();

    articles.forEach((article) => {
      const articleTags = getArticleTags(article);
      articleTags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    const totalReactions = articles.reduce(
      (sum, article) => sum + article.public_reactions_count,
      0,
    );
    const totalComments = articles.reduce(
      (sum, article) => sum + article.comments_count,
      0,
    );
    const totalViews = articles.reduce(
      (sum, article) => sum + (article.page_views_count || 0),
      0,
    );
    const avgReadingTime =
      articles.reduce((sum, article) => sum + article.reading_time_minutes, 0) /
      articles.length;

    const engagementData = [
      { name: 'Reações', value: Math.max(totalReactions, 0), color: COLORS[0] },
      {
        name: 'Comentários',
        value: Math.max(totalComments, 0),
        color: COLORS[1],
      },
      {
        name: 'Visualizações',
        value: Math.max(totalViews, 0),
        color: COLORS[2],
      },
    ];

    const finalEngagementData =
      engagementData.length > 0
        ? engagementData
        : [
            { name: 'Reações', value: 0, color: COLORS[0] },
            { name: 'Comentários', value: 0, color: COLORS[1] },
            { name: 'Visualizações', value: 0, color: COLORS[2] },
          ];

    return {
      totalPosts: articles.length,
      totalDrafts: drafts.length,
      totalTags: tagCounts.size,
      totalReactions,
      totalComments,
      totalViews,
      avgReadingTime: Math.round(avgReadingTime) || 0,
      topTags,
      engagementData: finalEngagementData,
    };
  }, [articlesData, drafts]);

  const handleDeleteArticle = async (articleId: number) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        toast.success(
          `Simular exclusão: Artigo excluído com sucesso ID: ${articleId}!`,
        );
      } catch (error) {
        toast.error('Erro ao excluir artigo');
      }
    }
  };

  if (isLoading && !articlesData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-[400px] bg-muted rounded w-full mb-2" />
        </div>
      </div>
    );
  }

  if (!stats || !articlesData) {
    return <div>Erro ao carregar dados</div>;
  }

  const { articles, total, totalPages, currentPage } = articlesData;

  return (
    <div className="space-y-8">
      {/* Header com perfil do usuário */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user?.avatar || '/placeholder.svg'}
              alt={user?.name}
            />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {user?.name}!
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                @{user?.username}
              </span>
            </div>
          </div>
        </div>
        <Link href="/account/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Post
          </Button>
        </Link>
      </div>

      {/* Cards de estatísticas melhorados */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats.totalPosts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Posts publicados
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engajamento Total
            </CardTitle>
            <Heart className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {formatNumber(stats.totalReactions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reações recebidas
            </p>
            <div className="flex items-center mt-2">
              <Activity className="h-3 w-3 text-orange-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                {formatNumber(stats.totalComments)} comentários
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <PenTool className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {stats.totalDrafts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Em desenvolvimento
            </p>
            <div className="flex items-center mt-2">
              <Target className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                Prontos para publicar
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {stats.avgReadingTime}min
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Leitura por post
            </p>
            <div className="flex items-center mt-2">
              <Users className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">
                Tempo ideal: 5-7min
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de artigos com paginação */}
      <Card>
        <CardHeader>
          <div className="flex md:flex-row flex-col items-center justify-between gap-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Meus Artigos ({total})
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
                      {article.published_at ? (
                        <Badge variant="outline" className="text-xs">
                          Publicado
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Rascunho</Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {article.published_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(article.published_at),
                              'dd/MM/yyyy',
                              { locale: ptBR },
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.reading_time_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>
                          {formatNumber(article.public_reactions_count)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{formatNumber(article.comments_count)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>
                          {formatNumber(article.page_views_count || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {getArticleTags(article)
                        .slice(0, 3)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/posts/${article.id}`}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/account/edit/${article.id}`}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
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
                      <DropdownMenuItem
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {articles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando seu primeiro post!
                </p>
                <Link href="/admin/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Post
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {
            <div className="flex md:flex-row flex-col gap-2 items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} ({total} artigos)
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
          }
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topTags}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="tag" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Distribuição do Engajamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    formatNumber(Number(value)),
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stats.engagementData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
