"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react"
import type { Draft } from "@/types/article"
import { useBlogStore } from "@/stores/blog-store"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DraftCardProps {
  draft: Draft
}

export function DraftCard({ draft }: DraftCardProps) {
  const { deleteDraft } = useBlogStore()

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este rascunho?")) {
      deleteDraft(draft.id)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {draft.title || "Rascunho sem título"}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Atualizado{" "}
                  {formatDistanceToNow(new Date(draft.updated_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/drafts/${draft.id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{draft.body_markdown.substring(0, 150)}...</p>

        {draft.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {draft.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {draft.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{draft.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/admin/drafts/${draft.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-2">
            <Edit className="h-4 w-4" />
            Continuar editando
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
