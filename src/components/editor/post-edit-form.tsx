'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Save,
  Eye,
  Send,
  X,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import {
  createArticleSchema,
  type CreateArticleFormData,
} from '@/schemas/article-schema';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  // useArticleForEdit,
  useUpdateArticle,
} from '@/services/hooks/articles/use-edit-article';
import { getArticleTags } from '@/utils/get-article-normalize';
import { Article } from '@/types/article';

interface PostEditFormProps {
  article: Article;
}

export function PostEditForm({ article }: PostEditFormProps) {
  const router = useRouter();

  const updateArticleMutation = useUpdateArticle();
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: '',
      body_markdown: '',
      description: '',
      tags: [],
      published: false,
      main_image: '',
      canonical_url: '',
      series: '',
    },
  });

  const { watch, setValue, getValues, reset } = form;
  const watchedTags = watch('tags') || [];

  useEffect(() => {
    if (article) {
      const articleTags = getArticleTags(article);
      reset({
        title: article.title,
        body_markdown: article.body_markdown,
        description: article.description || '',
        tags: articleTags,
        published: !!article.published_at,
        main_image: article.cover_image || '',
        canonical_url: article.canonical_url || '',
        series: article.series || '',
      });
    }
  }, [article, reset]);

  // Monitora mudanças no formulário
  useEffect(() => {
    const subscription = watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      watchedTags.length < 4 &&
      !watchedTags.includes(tagInput.trim())
    ) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      watchedTags.filter((tag) => tag !== tagToRemove),
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = async () => {
    const values = getValues();
    if (!values.title.trim()) {
      toast.error('Título é obrigatório para salvar');
      return;
    }

    try {
      await updateArticleMutation.mutateAsync({
        articleId: article.id.toString(),
        data: {
          article: {
            title: values.title,
            body_markdown: values.body_markdown,
            published: false,
            description: values.description,
            tags: values.tags,
            main_image: values.main_image || undefined,
            canonical_url: values.canonical_url || undefined,
            series: values.series || undefined,
          },
        },
      });
      setHasUnsavedChanges(false);
      toast.success('Rascunho salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  const onSubmit = async (data: CreateArticleFormData) => {
    try {
      await updateArticleMutation.mutateAsync({
        articleId: article.id.toString(),
        data: {
          article: {
            title: data.title,
            body_markdown: data.body_markdown,
            published: data.published,
            description: data.description,
            tags: data.tags,
            main_image: data.main_image || undefined,
            canonical_url: data.canonical_url || undefined,
            series: data.series || undefined,
          },
        },
      });

      setHasUnsavedChanges(false);
      router.push(
        data.published
          ? `/posts/${article.user.username}/${article.slug}`
          : '/drafts',
      );
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
    }
  };

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Link
              href={`/posts/${article.user.username}/${article.slug}`}
              target="_blank"
            >
              <Button variant="ghost" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver Post
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Editando: {article.title}</h1>
          <p className="text-muted-foreground">
            Artigo criado em{' '}
            {new Date(article.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Alterações não salvas
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="gap-2"
            disabled={updateArticleMutation.isPending}
          >
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {preview ? 'Editor' : 'Preview'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do seu post..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Breve descrição do post..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Tabs
                    value={preview ? 'preview' : 'editor'}
                    className="w-full"
                  >
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor">
                      <FormField
                        control={form.control}
                        name="body_markdown"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva seu post em Markdown..."
                                className="min-h-[400px] font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[400px] p-4 border rounded-md">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              watch('body_markdown')?.replace(/\n/g, '<br>') ||
                              '<p class="text-muted-foreground">Preview aparecerá aqui...</p>',
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Publicar imediatamente</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="main_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem de capa (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="canonical_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL canônica (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="series"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da série..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddTag())
                      }
                      disabled={watchedTags.length >= 4}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || watchedTags.length >= 4}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {watchedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Máximo 4 tags ({watchedTags.length}/4)
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={updateArticleMutation.isPending}
                >
                  {updateArticleMutation.isPending ? (
                    <p>Salvando as alterações...</p>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {watch('published')
                        ? 'Atualizar e Publicar'
                        : 'Salvar como Rascunho'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
