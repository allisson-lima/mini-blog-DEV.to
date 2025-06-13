'use client';

import { useBlogStore } from '@/stores/blog-store';
import { DraftCard } from './draft-card';
import { Button } from '@/components/ui/button';
import { PenTool, Plus } from 'lucide-react';
import Link from 'next/link';

export function DraftsList() {
  const { drafts } = useBlogStore();

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <PenTool className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Nenhum rascunho encontrado
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Comece a escrever um novo post e salve como rascunho para continuar
          mais tarde.
        </p>
        <Link href="/admin/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar novo post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Rascunhos ({drafts.length})</h1>
        <Link href="/admin/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo post
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
}
