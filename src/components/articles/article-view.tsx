"use client";

import { useArticle } from "@/services/hooks/use-articles";
import { useComments } from "@/services/hooks/use-comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CommentSection } from "./comment-section";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getArticleTags } from "@/utils/get-article-normalize";
interface ArticleViewProps {
  articleId: string;
}

export function ArticleView({ articleId }: ArticleViewProps) {
  const { data: article, isLoading } = useArticle(articleId);
  const { data: comments } = useComments(articleId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Post não encontrado</h2>
        <p className="text-muted-foreground">
          O post que você está procurando não existe.
        </p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={article.user.profile_image || "/placeholder.svg"}
              alt={article.user.name}
            />
            <AvatarFallback>{article.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{article.user.name}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(
                    new Date(article.published_at),
                    "dd 'de' MMMM, yyyy",
                    { locale: ptBR }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.reading_time_minutes} min de leitura</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {getArticleTags(article).map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        {article.cover_image && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={article.cover_image || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between py-4 border-y">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span>{article.public_reactions_count}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{article.comments_count}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article?.body_html }}
      />

      <Separator className="my-8" />

      <CommentSection articleId={articleId} comments={comments || []} />
    </article>
  );
}
