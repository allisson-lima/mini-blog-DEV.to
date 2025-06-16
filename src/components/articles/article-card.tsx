'use client';

import type React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, Clock } from 'lucide-react';
import type { Article } from '@/types/article';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBlogStore } from '@/stores/blog-store';
import { getArticleTags } from '@/utils/get-article-normalize';
import { BlurFade } from '../blur-fade';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact';
  indice_fade?: number;
}

export function ArticleCard({
  article,
  variant = 'default',
  indice_fade,
}: ArticleCardProps) {
  const { toggleTag } = useBlogStore();

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    toggleTag(tag);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={article.user.profile_image || '/placeholder.svg'}
              alt={article.user.name}
            />
            <AvatarFallback>{article.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{article.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(article.published_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        {article.cover_image && variant === 'default' && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-accent">
            <BlurFade delay={indice_fade ? 0.1 + indice_fade * 0.01 : 0} inView>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={article.cover_image || '/placeholder.svg'}
                  alt={article.title}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </BlurFade>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <Link
          href={`/posts/${article.user.username}/${article.slug}`}
          className="block group"
        >
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
            {article.description}
          </p>
        </Link>

        <div className="flex flex-wrap gap-1 ">
          {getArticleTags(article)
            .slice(0, 4)
            .map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => handleTagClick(tag, e)}
              >
                #{tag}
              </Badge>
            ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{article.public_reactions_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{article.comments_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time_minutes} min</span>
            </div>
          </div>

          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
