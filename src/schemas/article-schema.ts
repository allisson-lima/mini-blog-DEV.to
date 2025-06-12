import { z } from "zod"

export const createArticleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  body_markdown: z.string().min(1, "Conteúdo é obrigatório"),
  description: z.string().max(160, "Descrição muito longa").optional(),
  tags: z.array(z.string()).max(4, "Máximo 4 tags").optional(),
  published: z.boolean().default(false),
  main_image: z.string().url("URL inválida").optional().or(z.literal("")),
  canonical_url: z.string().url("URL inválida").optional().or(z.literal("")),
  series: z.string().optional(),
})

export const draftSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  body_markdown: z.string().min(1, "Conteúdo é obrigatório"),
  tags: z.array(z.string()).max(4, "Máximo 4 tags").default([]),
})

export const commentSchema = z.object({
  body_markdown: z.string().min(1, "Comentário é obrigatório").max(1000, "Comentário muito longo"),
})

export type CreateArticleFormData = z.infer<typeof createArticleSchema>
export type DraftFormData = z.infer<typeof draftSchema>
export type CommentFormData = z.infer<typeof commentSchema>
