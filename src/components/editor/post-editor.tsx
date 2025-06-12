"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Send, X } from "lucide-react";
import {
  createArticleSchema,
  type CreateArticleFormData,
} from "@/schemas/article-schema";
import { useBlogStore } from "@/stores/blog-store";
import { useCreateArticle } from "@/services/hooks/use-articles";
import { toast } from "sonner";

interface PostEditorProps {
  draftId?: string;
}

export function PostEditor({ draftId }: PostEditorProps) {
  const router = useRouter();
  const { drafts, addDraft, updateDraft, setCurrentDraft } = useBlogStore();
  const createArticleMutation = useCreateArticle();
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);

  const form = useForm({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      body_markdown: "",
      description: "",
      tags: [],
      published: false,
      main_image: "",
      canonical_url: "",
      series: "",
    },
  });

  const { watch, setValue, getValues } = form;
  const watchedTags = watch("tags") || [];

  useEffect(() => {
    if (draftId) {
      const draft = drafts.find((d) => d.id === draftId);
      if (draft) {
        setCurrentDraft(draft);
        form.reset({
          title: draft.title,
          body_markdown: draft.body_markdown,
          tags: draft.tags,
          published: false,
          description: "",
          main_image: "",
          canonical_url: "",
          series: "",
        });
      }
    }
  }, [draftId, drafts, form, setCurrentDraft]);

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      watchedTags.length < 4 &&
      !watchedTags.includes(tagInput.trim())
    ) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSaveDraft = () => {
    const values = getValues();
    if (!values.title.trim()) {
      toast.error("Título é obrigatório para salvar o rascunho");
      return;
    }

    if (draftId) {
      updateDraft(draftId, {
        title: values.title,
        body_markdown: values.body_markdown,
        tags: values.tags || [],
      });
    } else {
      addDraft({
        title: values.title,
        body_markdown: values.body_markdown,
        tags: values.tags || [],
      });
    }

    toast.success("Rascunho salvo com sucesso!");
  };

  const onSubmit = async (data: CreateArticleFormData) => {
    try {
      await createArticleMutation.mutateAsync({
        article: {
          title: data.title,
          body_markdown: data.body_markdown,
          published: data.published,
          description: data.description,
          tags: data.tags || [],
          main_image: data.main_image || undefined,
          canonical_url: data.canonical_url || undefined,
          series: data.series || undefined,
        },
      });

      if (draftId) {
        // excluir o rascunho após a publicação
        // deleteDraft(draftId);
      }

      router.push("/");
    } catch (error) {
      console.error("Erro ao publicar:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {draftId ? "Editando Rascunho" : "Novo Post"}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {preview ? "Editor" : "Preview"}
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
                    value={preview ? "preview" : "editor"}
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
                              watch("body_markdown")?.replace(/\n/g, "<br>") ||
                              '<p className="text-muted-foreground">Preview aparecerá aqui...</p>',
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
                        e.key === "Enter" &&
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
                  disabled={createArticleMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                  {watch("published")
                    ? "Publicar Post"
                    : "Salvar como Rascunho"}
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
