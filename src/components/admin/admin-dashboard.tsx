"use client";

import { useBlogStore } from "@/stores/blog-store";
import { useArticles } from "@/services/hooks/use-articles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, PenTool, Tag, TrendingUp, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { getArticleTags } from "@/utils/get-article-normalize";

export function AdminDashboard() {
  const { drafts } = useBlogStore();
  const { data: articles } = useArticles();

  const stats = useMemo(() => {
    if (!articles) return null;

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
      0
    );
    const totalComments = articles.reduce(
      (sum, article) => sum + article.comments_count,
      0
    );

    return {
      totalPosts: articles.length,
      totalDrafts: drafts.length,
      totalTags: tagCounts.size,
      totalReactions,
      totalComments,
      topTags,
    };
  }, [articles, drafts]);

  if (!stats) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do seu blog e estatísticas
          </p>
        </div>
        <Link href="/admin/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Posts publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrafts}</div>
            <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Únicas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTags}</div>
            <p className="text-xs text-muted-foreground">
              Categorias diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReactions}</div>
            <p className="text-xs text-muted-foreground">Total de reações</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tags Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topTags}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/new">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Criar Novo Post
              </Button>
            </Link>

            <Link href="/drafts">
              <Button className="w-full justify-start gap-2" variant="outline">
                <PenTool className="h-4 w-4" />
                Ver Rascunhos ({stats.totalDrafts})
              </Button>
            </Link>

            <Link href="/tags">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Tag className="h-4 w-4" />
                Gerenciar Tags
              </Button>
            </Link>

            <Link href="/">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Eye className="h-4 w-4" />
                Ver Blog Público
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rascunhos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drafts.slice(0, 5).map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{draft.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {draft.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/admin/drafts/${draft.id}`}>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
