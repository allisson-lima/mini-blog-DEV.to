'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { MessageCircle, Reply } from 'lucide-react';
import type { Comment } from '@/types/article';
import { commentSchema, type CommentFormData } from '@/schemas/article-schema';
import { useAddComment } from '@/services/hooks/use-comments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  level?: number;
}

function CommentItem({ comment, level = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.user.profile_image || '/placeholder.svg'}
                alt={comment.user.name}
              />
              <AvatarFallback>{comment?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{comment?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.body_html }}
          />
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="gap-1 text-xs"
            >
              <Reply className="h-3 w-3" />
              Responder
            </Button>
          </div>
        </CardContent>
      </Card>

      {comment.children?.map((child, index) => (
        <CommentItem
          key={`${child.id}-${index}`}
          comment={child}
          level={level + 1}
        />
      ))}
    </div>
  );
}

export function CommentSection({ articleId, comments }: CommentSectionProps) {
  const addCommentMutation = useAddComment();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body_markdown: '',
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      await addCommentMutation.mutateAsync({
        articleId,
        body: data.body_markdown,
      });
      form.reset();
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-bold">Comentários ({comments.length})</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="body_markdown"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva seu comentário..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={addCommentMutation.isPending}
                  className="gap-2"
                >
                  {addCommentMutation.isPending ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentItem key={`${comment.id}-${index}`} comment={comment} />
          ))
        )}
      </div>
    </section>
  );
}
