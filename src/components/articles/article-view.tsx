'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  LinkIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommentSection } from './comment-section';
import Image from 'next/image';
import type { Article } from '@/types/article';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useArticle } from '@/services/hooks/use-articles';
import { useComments } from '@/services/hooks/use-comments';
import { getArticleTags } from '@/utils/get-article-normalize';
import { MarkdownRenderer } from '../markdown-renderer';

interface ArticleViewProps {
  articleId: string;
  article?: Article;
}

export function ArticleView({
  articleId,
  article: initialArticle,
}: ArticleViewProps) {
  const { data: clientArticle } = useArticle(articleId);
  const { data: comments } = useComments(articleId);
  const [article, setArticle] = useState<Article | undefined>(initialArticle);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (clientArticle) {
      setArticle(clientArticle);
    }
  }, [clientArticle]);

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
      text: article?.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (!article) {
    return null;
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
              src={article.user.profile_image || '/placeholder.svg'}
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
                    { locale: ptBR },
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
              src={article.cover_image || '/placeholder.svg'}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {copied ? (
                <LinkIcon className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <MarkdownRenderer markdown={article.body_markdown} />

      <Separator className="my-8" />
      <CommentSection articleId={articleId} comments={comments || []} />
    </article>
  );
}
